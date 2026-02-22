import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to home
    </Link>
  )
}
