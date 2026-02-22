"use client"

import type { Transaction } from "@/lib/types"

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60">
              <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-3.5">
                Date
              </th>
              <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-3.5">
                Description
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-3.5">
                Amount
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5 sm:py-3.5">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr
                key={i}
                className="group border-b border-border/60 last:border-b-0 transition-colors hover:bg-secondary/30"
              >
                <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-card-foreground sm:px-5 sm:py-3.5">
                  {tx.date}
                </td>
                <td className="min-w-[120px] max-w-[200px] truncate px-3 py-3 text-xs text-card-foreground sm:max-w-xs sm:px-5 sm:py-3.5 sm:text-sm">
                  {tx.description}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-xs font-medium sm:px-5 sm:py-3.5">
                  {tx.amount === 0 ? (
                    <span className="text-muted-foreground">&mdash;</span>
                  ) : tx.amount < 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-destructive/8 px-2 py-0.5 text-destructive">
                      {"-"}${Math.abs(tx.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5"
                      style={{
                        backgroundColor: "hsl(var(--accent) / 0.08)",
                        color: "hsl(var(--accent))",
                      }}
                    >
                      {"+"}${tx.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right font-mono text-xs text-muted-foreground sm:px-5 sm:py-3.5">
                  {tx.balance !== null
                    ? `$${tx.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "\u2014"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
