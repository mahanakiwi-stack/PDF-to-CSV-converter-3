"use client"

import { useState } from "react"
import { Shield, Eye, Trash2, Server, FileText, Cpu, ChevronDown } from "lucide-react"

const items = [
  {
    icon: FileText,
    title: "PDF stays local",
    description:
      "Your PDF is read and parsed entirely in your browser using pdf.js. The original file is never uploaded to any server, regardless of which mode you choose.",
  },
  {
    icon: Cpu,
    title: "Two processing modes",
    description:
      "Local Only mode parses everything in your browser -- nothing leaves your device. AI-Powered mode sends only the extracted text (not the PDF) to Claude AI for more accurate results.",
  },
  {
    icon: Eye,
    title: "AI mode transparency",
    description: (
      <>
        When using AI-Powered mode, the extracted text is sent to
        Anthropic&apos;s Claude AI for structuring. This text may include
        details visible on your statement. Anthropic&apos;s{" "}
        <a
          href="https://www.anthropic.com/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2 transition-colors hover:text-foreground"
        >
          privacy policy
        </a>{" "}
        applies. Local Only mode bypasses this entirely.
      </>
    ),
  },
  {
    icon: Trash2,
    title: "Never stored",
    description:
      "Neither your PDF nor the extracted text is saved, logged, or retained anywhere. Once the CSV is generated, all data is discarded.",
  },
  {
    icon: Server,
    title: "No database",
    description:
      "No user accounts, no database storage. The extracted text goes in, the CSV comes out, and that's it.",
  },
  {
    icon: Shield,
    title: "Rate limited",
    description:
      "AI-Powered requests are rate limited to prevent abuse and protect the service. Local Only mode has no limits.",
  },
]

export function PrivacyNotice() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6 md:p-8">
      {/* Header - clickable on mobile/tablet to toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between md:pointer-events-none"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}
          >
            <Shield
              className="h-4 w-4"
              style={{ color: "hsl(var(--accent))" }}
            />
          </div>
          <h3 className="text-sm font-bold tracking-tight text-card-foreground">
            How we handle your data
          </h3>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 md:hidden ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content - collapsible on mobile/tablet, always visible on desktop */}
      <div
        className={`grid transition-all duration-200 md:grid-rows-[1fr] md:opacity-100 ${
          isOpen
            ? "mt-6 grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 md:mt-6"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-5 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex gap-3.5 rounded-lg p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-background">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">
                    {title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
