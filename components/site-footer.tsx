import Link from "next/link"
import { ContactLinks } from "@/components/contact-links"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-medium text-foreground/70">
            Have an issue or question? Reach out directly to the founder
          </p>
          <ContactLinks />
        </div>
        <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[10px] text-muted-foreground/50">
            {"Copyright \u00A9 Vergos Limited 2026"}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[10px] text-muted-foreground/50 underline underline-offset-2 transition-colors hover:text-muted-foreground"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-[10px] text-muted-foreground/50 underline underline-offset-2 transition-colors hover:text-muted-foreground"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="text-[10px] text-muted-foreground/50 underline underline-offset-2 transition-colors hover:text-muted-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-[10px] text-muted-foreground/50 underline underline-offset-2 transition-colors hover:text-muted-foreground"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
