import type { Transaction } from "./types"

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

export function transactionsToCSV(transactions: Transaction[]): string {
  const header = "Transaction Date,Transaction Description,Transaction Amount,Balance"
  const rows = transactions.map((tx) =>
    [
      escapeCSVField(tx.date),
      escapeCSVField(tx.description),
      tx.amount.toFixed(2),
      tx.balance !== null ? tx.balance.toFixed(2) : "",
    ].join(",")
  )
  return [header, ...rows].join("\n")
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
