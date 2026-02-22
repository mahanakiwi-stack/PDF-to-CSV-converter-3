import { generateText, Output } from "ai"
import { z } from "zod"
import { rateLimiter } from "@/lib/rate-limit"
import { checkAndRecordUsage } from "@/lib/usage"
import { supabase } from "@/lib/supabase"

const transactionSchema = z.object({
  transactions: z.array(
    z.object({
      date: z.string().describe("Transaction date in YYYY-MM-DD format"),
      description: z
        .string()
        .describe("Full transaction description as shown on the statement"),
      amount: z
        .number()
        .describe(
          "Transaction amount. Negative for debits/withdrawals, positive for credits/deposits"
        ),
      balance: z
        .number()
        .nullable()
        .describe(
          "Running balance after this transaction, or null if not shown"
        ),
    })
  ),
})

export async function POST(req: Request) {
  try {
    // Rate limiting by IP (burst protection)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "anonymous"

    const { success } = await rateLimiter.limit(ip)

    if (!success) {
      return Response.json(
        {
          error:
            "Too many requests. Please wait a minute before trying again.",
        },
        { status: 429 }
      )
    }

    const { text, pageCount, fileName, mode, sessionId, userId } = await req.json()

    if (!text || typeof text !== "string") {
      return Response.json(
        { error: "No statement text provided" },
        { status: 400 }
      )
    }

    if (text.length > 200_000) {
      return Response.json(
        { error: "Statement text is too large. Please try a smaller document." },
        { status: 400 }
      )
    }

    const pages = typeof pageCount === "number" && pageCount > 0 ? pageCount : 1

    // Get authenticated user if they exist
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { output } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      output: Output.object({
        schema: transactionSchema,
      }),
      messages: [
        {
          role: "user",
          content: `You are given the raw extracted text from a bank statement PDF. Parse it and extract ALL transactions.

For each transaction, provide:
- date: The transaction date in YYYY-MM-DD format
- description: The full transaction description exactly as shown
- amount: The transaction amount as a number. Use NEGATIVE values for debits/withdrawals/payments and POSITIVE values for credits/deposits/incoming transfers
- balance: The running balance after this transaction (null if not shown on the statement)

IMPORTANT RULES:
- If the statement shows an "Opening Balance" or "Beginning Balance", include it as the FIRST entry with a transaction amount of 0 and the balance set to the opening balance value. Use the description "Opening Balance".
- Do NOT include "Closing Balance" or "Ending Balance" lines.
- For all other entries, only extract real transactions that represent actual money moving in or out of the account (e.g. purchases, deposits, transfers, fees, interest, payments).
- Be thorough and extract every single real transaction.
- Maintain the chronological order as shown in the statement.

Here is the extracted text from the bank statement:

${text}`,
        },
      ],
    })

    const transactions = output?.transactions ?? []

    // Validate that this is actually a bank statement
    // A valid bank statement should have at least one transaction or opening balance
    if (!transactions || transactions.length === 0) {
      return Response.json(
        { 
          error: "This document does not appear to be a bank statement. Please upload a valid bank statement PDF with transaction details.",
          isInvalidDocument: true
        },
        { status: 400 }
      )
    }

    // Now check usage with transaction data
    const { transactionsToCSV } = await import("@/lib/csv")
    const csv = transactions.length > 0 ? transactionsToCSV(transactions) : ""
    
    // For authenticated users, pass userId; for anonymous users, pass sessionId
    const userForUsage = userId ? { id: userId } : null
    const { getOrCreateAnonSessionId } = await import("@/lib/session")
    const sessionIdForUsage = !userForUsage ? await getOrCreateAnonSessionId() : undefined
    
    const usageResult = await checkAndRecordUsage(pages, userForUsage, sessionIdForUsage, {
      fileName: typeof fileName === "string" ? fileName : "statement.pdf",
      transactionCount: transactions.length,
      csvData: csv,
    })

    if (!usageResult.success) {
      return Response.json(
        { error: usageResult.error, usage: usageResult.usage },
        { status: 429 }
      )
    }

    // Save conversion for authenticated and anonymous users
    try {
      const user_id = user?.id || userId // Use authenticated user ID or the UUID passed from frontend

      if (user_id && transactions.length > 0) {
        await supabase.from("conversions").insert({
          user_id,
          file_name: typeof fileName === "string" ? fileName : "statement.pdf",
          page_count: pages,
          transaction_count: transactions.length,
          csv_data: csv,
          mode: mode === "local" ? "local" : "ai",
        })
      }
    } catch (error) {
      console.error("Failed to save conversion history:", error)
    }

    return Response.json({
      transactions,
      usage: usageResult.usage,
    })
  } catch (error) {
    console.error("Error parsing statement:", error)
    const message =
      error instanceof Error
        ? error.message
        : "Failed to parse the bank statement. Please try again."
    return Response.json({ error: message }, { status: 500 })
  }
}
