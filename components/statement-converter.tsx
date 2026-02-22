"use client"

import { useState, useCallback, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { UploadDropzone } from "./upload-dropzone"
import { TransactionsTable } from "./transactions-table"
import { transactionsToCSV, downloadCSV } from "@/lib/csv"
import type { Transaction } from "@/lib/types"
import { extractTextFromPDF, getPageCount } from "@/lib/pdf-extract"
import { parseTransactionsLocally } from "@/lib/local-parse"
import {
  Download,
  Loader2,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Cloud,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"
import type { UsageInfo } from "@/lib/usage"

const FREE_DAILY_LIMIT = 5

type Status = "idle" | "processing" | "done" | "error"
type Mode = "local" | "ai"

export function StatementConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [mode, setMode] = useState<Mode>("local")
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [expandedMode, setExpandedMode] = useState<Mode | null>(null)

  useEffect(() => {
    const fetchUsage = async () => {
      // First, try to restore from localStorage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('usage_state')
        if (saved) {
          setUsage(JSON.parse(saved))
          return // Use saved state, don't fetch from API
        }
      }

      // If no saved state, fetch from API
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        
        // Build URL with appropriate parameters
        let url = '/api/usage'
        if (user) {
          // Authenticated user - pass user ID
          url = `/api/usage?userId=${user.id}`
        } else {
          // Anonymous user - get session ID from server
          url = '/api/usage'
        }
        
        const res = await fetch(url)
        const data = await res.json()
        setUsage(data)
        // Save usage to localStorage for persistence across page refreshes and logouts
        if (typeof window !== 'undefined') {
          localStorage.setItem('usage_state', JSON.stringify(data))
        }
      } catch (err) {
        console.error('[v0] Error fetching usage:', err)
      }
    }
    fetchUsage()
  }, [])

  // Refetch usage when user logs in
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
      // Refetch usage only when user logs in
      if (event === 'SIGNED_IN' && session?.user?.id) {
        try {
          const res = await fetch(`/api/usage?userId=${session.user.id}`)
          const data = await res.json()
          setUsage(data)
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('usage_state', JSON.stringify(data))
          }
        } catch (err) {
          console.error('[v0] Error fetching usage on sign in:', err)
        }
      }
      // Do NOT refetch on SIGNED_OUT - keep the same usage limits to prevent gaming the system
    })

    // The subscription object has a data property with the unsubscribe function
    return () => {
      subscription.data.subscription?.unsubscribe()
    }
  }, [])

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setTransactions([])
    setStatus("idle")
    setErrorMessage("")
  }, [])

  const handleClear = useCallback(() => {
    setFile(null)
    setTransactions([])
    setStatus("idle")
    setErrorMessage("")
  }, [])

  const handleConvert = useCallback(async () => {
    if (!file) return

    setStatus("processing")
    setErrorMessage("")

    try {
      const extractedText = await extractTextFromPDF(file)
      const pageCount = await getPageCount(file)

      // Check if document size exceeds remaining pages
      if (usage && pageCount > usage.remaining) {
        setErrorMessage("document_exceeds_limit")
        setStatus("error")
        return
      }

      // Get or create session ID and generate UUID for anonymous users
      let userId: string | null = null
      
      // First, check if user is authenticated
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser?.id) {
        userId = authUser.id
      } else {
        // Anonymous user - use session ID
        const sessionId = typeof window !== 'undefined' ? localStorage.getItem('anon_session_id') : null
        if (sessionId) {
          // Generate UUID from sessionId for consistent user tracking
          const utf8 = new TextEncoder().encode(`6ba7b810-9dad-11d1-80b4-00c04fd430c8${sessionId}`)
          const hashBuffer = await crypto.subtle.digest('SHA-1', utf8)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
          userId = `${hashHex.slice(0, 8)}-${hashHex.slice(8, 12)}-5${hashHex.slice(13, 16)}-${((parseInt(hashHex.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0')}${hashHex.slice(18, 20)}-${hashHex.slice(20, 32)}`
        }
      }

      if (mode === "local") {
        const parsed = parseTransactionsLocally(extractedText)
        const csv = parsed.length > 0 ? transactionsToCSV(parsed) : ""

          const recordRes = await fetch("/api/record-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pageCount,
              fileName: file.name,
              transactionCount: parsed.length,
              csvData: csv || undefined,
              mode: "local",
              userId,
            }),
          })

          const recordData = await recordRes.json()

        if (recordRes.status === 429) {
          // Use the usage data from the response
          if (recordData.usage) {
            setUsage(recordData.usage)
            // Save to localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('usage_state', JSON.stringify(recordData.usage))
            }
          }
          setErrorMessage("limit_exceeded")
          setStatus("error")
          return
        }

        setTransactions(parsed)
        if (recordData.usage) {
          setUsage(recordData.usage)
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('usage_state', JSON.stringify(recordData.usage))
          }
        }
        
        // Save conversion to history
        await saveConversion({
          file_name: file.name,
          page_count: pageCount,
          transaction_count: parsed.length,
          processing_mode: "local",
          csv_data: csv || "",
        })
        
        setStatus("done")
      } else {
        const response = await fetch("/api/parse-statement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: extractedText,
            pageCount,
            fileName: file.name,
            mode: "ai",
            userId,
          }),
        })

        const data = await response.json()

        if (response.status === 429) {
          // Use the usage data from the response
          if (data.usage) {
            setUsage(data.usage)
            // Save to localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('usage_state', JSON.stringify(data.usage))
            }
          }
          setErrorMessage("limit_exceeded")
          setStatus("error")
          return
        }

        if (response.status === 400 && data.isInvalidDocument) {
          // Document is not a valid bank statement - don't count it toward limit
          setErrorMessage("invalid_document")
          setStatus("error")
          return
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to parse statement")
        }

        setTransactions(data.transactions)
        if (data.usage) {
          setUsage(data.usage)
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('usage_state', JSON.stringify(data.usage))
          }
        }
        
        // Save conversion to history
        const csv = transactionsToCSV(data.transactions)
        await saveConversion({
          file_name: file.name,
          page_count: pageCount,
          transaction_count: data.transactions.length,
          processing_mode: "ai",
          csv_data: csv,
        })
        
        setStatus("done")
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong"
      setErrorMessage(errorMsg)
      setStatus("error")
    }
  }, [file, mode])

  const saveConversion = useCallback(async (conversionData: {
    file_name: string
    page_count: number
    transaction_count: number
    processing_mode: "ai" | "local"
    csv_data?: string | null
  }) => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      
      let userId: string | null = null
      
      if (session?.user) {
        // Authenticated user
        userId = session.user.id
      }
      // For anonymous users, the server will handle the session ID via cookies
      
      const response = await fetch("/api/conversions/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...conversionData,
          user_id: userId,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error("[v0] Failed to save conversion:", data.error)
        return
      }
    } catch (err) {
      console.error("[v0] Error saving conversion:", err)
    }
  }, [])

  const handleDownload = useCallback(() => {
    if (transactions.length === 0) return

    const csv = transactionsToCSV(transactions)
    const name = file?.name?.replace(/\.pdf$/i, "") || "statement"
    downloadCSV(csv, `${name}_transactions.csv`)
  }, [transactions, file])

  return (
    <div className="flex flex-col gap-10">
      {/* Usage indicator */}
      {usage && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-card-foreground">
              {usage.remaining} / {usage.limit} pages remaining today
            </div>
            {!usage.isAuthenticated && (
              <Link
                href="/auth/sign-up"
                className="text-xs font-medium underline underline-offset-2 transition-colors hover:text-foreground"
                style={{ color: "hsl(var(--accent))" }}
              >
                Sign up for 5 free pages/day
              </Link>
            )}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary sm:w-32">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, usage.limit > 0 ? (usage.used / usage.limit) * 100 : 0)}%`,
                backgroundColor:
                  usage.remaining === 0
                    ? "hsl(var(--destructive))"
                    : "hsl(var(--accent))",
              }}
            />
          </div>
        </div>
      )}

      {/* Show limit reached message when usage is loaded and limit is 0 */}
      {usage && usage.remaining === 0 && status === "idle" && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 space-y-2">
          <p className="text-sm text-destructive font-medium">Daily limit reached</p>
          {!usage.isAuthenticated ? (
            <div className="pt-1">
              <p className="text-xs text-destructive/80 mb-2">
                You've used your {usage.limit} free pages for today.
              </p>
              <Link
                href="/auth/sign-up"
                className="inline-block text-xs font-medium text-white bg-destructive hover:bg-destructive/90 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign up for {FREE_DAILY_LIMIT} free pages/day
              </Link>
            </div>
          ) : (
            <p className="text-xs text-destructive/80 pt-1">
              You've reached your daily limit of {usage.limit} pages. Please try again tomorrow or upgrade your plan.
            </p>
          )}
        </div>
      )}

      {/* Step 1: Upload */}
      <section>
        <StepHeader
          number={1}
          title="Upload Statement"
          done={status === "done" || status === "processing"}
        />
        <UploadDropzone
          onFileSelect={handleFileSelect}
          file={file}
          onClear={handleClear}
          disabled={status === "processing"}
        />
      </section>

      {/* Step 2: Choose Mode & Convert */}
      <section>
        <StepHeader number={2} title="Convert to CSV" done={status === "done"} />

        {/* Mode Toggle */}
        <div className="mb-5">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">
            Processing mode
          </p>
          <div className="flex flex-col gap-3">
            <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-sm w-fit">
              <ModeButton
                active={mode === "local"}
                onClick={() => {
                  setMode("local")
                  setExpandedMode(null)
                }}
                disabled={status === "processing"}
                icon={<Cpu className="h-3.5 w-3.5" />}
                label="Local Only"
                tooltip="Parses entirely in your browser using pattern matching. Maximum privacy -- nothing leaves your device. May be less accurate for unusual formats."
                expanded={expandedMode === "local"}
                onToggleExpand={() => setExpandedMode(expandedMode === "local" ? null : "local")}
              />
              <ModeButton
                active={mode === "ai"}
                onClick={() => {
                  setMode("ai")
                  setExpandedMode(null)
                }}
                disabled={status === "processing"}
                icon={<Cloud className="h-3.5 w-3.5" />}
                label="AI-Powered"
                tooltip="Sends extracted text to Claude AI for highly accurate parsing. Handles any bank format. Your PDF never leaves the browser."
                expanded={expandedMode === "ai"}
                onToggleExpand={() => setExpandedMode(expandedMode === "ai" ? null : "ai")}
              />
            </div>
            
            {/* Mobile mode descriptions */}
            {expandedMode && (
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-3 text-xs text-muted-foreground leading-relaxed md:hidden">
                {expandedMode === "ai" 
                  ? "Sends extracted text to Claude AI for highly accurate parsing. Handles any bank format. Your PDF never leaves the browser."
                  : "Parses entirely in your browser using pattern matching. Maximum privacy -- nothing leaves your device. May be less accurate for unusual formats."
                }
              </div>
            )}
          </div>
        </div>

        {status === "error" && (
          <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 space-y-2">
            {errorMessage === "limit_exceeded" ? (
              <>
                <p className="text-sm text-destructive font-medium">Daily limit reached</p>
                {!usage?.isAuthenticated ? (
                  <div className="pt-1">
                    <p className="text-xs text-destructive/80 mb-2">
                      You've used your {usage?.limit} free pages for today.
                    </p>
                    <Link
                      href="/auth/sign-up"
                      className="inline-block text-xs font-medium text-white bg-destructive hover:bg-destructive/90 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Sign up for {FREE_DAILY_LIMIT} free pages/day
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs text-destructive/80 pt-1">
                    You've reached your daily limit of {usage?.limit} pages. Please try again tomorrow or upgrade your plan.
                  </p>
                )}
              </>
            ) : errorMessage === "document_exceeds_limit" ? (
              <>
                <p className="text-sm text-destructive font-medium">Document size exceeds remaining pages</p>
                <p className="text-xs text-destructive/80 pt-1">
                  This document has more pages than your remaining daily limit. You have {usage?.remaining} {usage?.remaining === 1 ? 'page' : 'pages'} remaining.
                </p>
              </>
            ) : errorMessage === "invalid_document" ? (
              <>
                <p className="text-sm text-destructive font-medium">Invalid document</p>
                <p className="text-xs text-destructive/80 pt-1">
                  This document does not appear to be a bank statement. Please upload a valid bank statement PDF with transaction details.
                </p>
              </>
            ) : (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleConvert}
            disabled={!file || status === "processing" || (usage?.remaining === 0)}
            size="lg"
            className="gap-2.5 rounded-xl px-6 shadow-sm transition-shadow hover:shadow-md"
            style={{
              backgroundColor: "hsl(var(--accent))",
              color: "hsl(var(--accent-foreground))",
            }}
          >
            {status === "processing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "ai" ? "Analyzing with AI..." : "Parsing locally..."}
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
                Convert Statement
              </>
            )}
          </Button>

          {status === "done" && (
            <Button
              onClick={handleClear}
              variant="outline"
              size="lg"
              className="gap-2 rounded-xl"
            >
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
          )}
        </div>

        {status === "processing" && mode === "ai" && (
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full animate-pulse rounded-full"
                style={{
                  backgroundColor: "hsl(var(--accent))",
                  width: "65%",
                  animation:
                    "pulse 2s ease-in-out infinite, grow 8s ease-out forwards",
                }}
              />
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              Reading transactions...
            </span>
          </div>
        )}
      </section>

      {/* Step 3: Preview & Download */}
      {status === "done" && transactions.length > 0 && (
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <StepHeader number={3} title="Preview & Download" done />
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {transactions.length} transaction
                {transactions.length !== 1 ? "s" : ""} found
              </span>
              <Button
                onClick={handleDownload}
                className="gap-2 rounded-xl shadow-sm transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: "hsl(var(--accent))",
                  color: "hsl(var(--accent-foreground))",
                }}
              >
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>
          <TransactionsTable transactions={transactions} />
        </section>
      )}

      {status === "done" && transactions.length === 0 && (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center shadow-sm">
          <p className="text-muted-foreground">
            No transactions found in this document.
            {mode === "local"
              ? " Try switching to AI-Powered mode for better accuracy."
              : " Please try a different statement."}
          </p>
        </div>
      )}
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  disabled,
  icon,
  label,
  tooltip,
  expanded,
  onToggleExpand,
}: {
  active: boolean
  onClick: () => void
  disabled: boolean
  icon: React.ReactNode
  label: string
  tooltip: string
  expanded?: boolean
  onToggleExpand?: () => void
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => {
              // Always set the mode first
              onClick()
              // Then handle mobile expand on small screens
              if (window.innerWidth < 768 && onToggleExpand) {
                onToggleExpand()
              }
            }}
            disabled={disabled}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50 md:hover:opacity-80 ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {icon}
            {label}
            <Info className={`h-3 w-3 opacity-40 transition-transform ${expanded ? "rotate-180" : ""} md:rotate-0`} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="hidden max-w-[260px] text-xs md:block">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function StepHeader({
  number,
  title,
  done,
}: {
  number: number
  title: string
  done?: boolean
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300"
        style={
          done
            ? {
                backgroundColor: "hsl(var(--accent))",
                color: "hsl(var(--accent-foreground))",
              }
            : {}
        }
      >
        {done ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {number}
          </span>
        )}
      </span>
      <h2 className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </h2>
    </div>
  )
}
