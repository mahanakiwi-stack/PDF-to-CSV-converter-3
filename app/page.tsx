import { StatementConverter } from "@/components/statement-converter"
import { PrivacyNotice } from "@/components/privacy-notice"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Shield,
  Zap,
  FileSpreadsheet,
  ArrowDown,
  Cpu,
} from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <SiteHeader />

      {/* Hero */}
      <section className="grain relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.08),transparent)]" />
        <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-12 sm:px-6 md:pb-16 md:pt-20">
          <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl md:text-5xl md:leading-[1.1]">
            PDF bank statements{" "}
            <span style={{ color: "hsl(var(--accent))" }}>to CSV</span>
          </h2>
          <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Upload a PDF bank statement and get a clean, structured CSV with
            transaction dates, descriptions, amounts, and balances.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 md:gap-8">
            {[
              { icon: Zap, label: "AI or local parsing" },
              { icon: Cpu, label: "Full privacy mode" },
              { icon: Shield, label: "Secure processing" },
              { icon: FileSpreadsheet, label: "Clean CSV output" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}
                >
                  <Icon
                    className="h-3.5 w-3.5"
                    style={{ color: "hsl(var(--accent))" }}
                  />
                </div>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground/60">
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
            <span>Upload below to get started</span>
          </div>
        </div>
      </section>

      {/* Converter */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
        <StatementConverter />
      </section>

      {/* Privacy Notice */}
      <section className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 md:pb-12">
        <PrivacyNotice />
      </section>

      {/* Footer */}
      <SiteFooter />
    </main>
  )
}
