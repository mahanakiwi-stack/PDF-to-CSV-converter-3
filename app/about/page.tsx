import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BackButton } from "@/components/back-button"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - PDF Bank Statements to CSV",
  description:
    "Meet Ryan Vergottini, the founder and developer behind PDF Bank Statements to CSV.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20">
        <BackButton />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {"Welcome to \u2018PDF bank statements to CSV\u2019"}
        </h1>

        <div className="mt-10 overflow-hidden rounded-xl border border-border shadow-sm">
          <Image
            src="/images/ryan.jpg"
            alt="Ryan Vergottini, founder of PDF Bank Statements to CSV"
            width={800}
            height={600}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
          <p>
            My name is Ryan Vergottini. I am the founder and developer of the
            site.
          </p>

          <p>
            {"I am a South African born, New Zealand based (yes, I support the All Blacks\uD83D\uDE01 \u2013 I\u2019ll probably switch back allegiances to the Boks if the AB\u2019s continue to play like this) entrepreneur."}
          </p>

          <p>
            {"My formal training is in Chartered Accountancy, and I run a small solo tax practice based in Auckland, alongside running \u2018PDF bank statements to CSV\u2019."}
          </p>

          <p>
            {"I guess you can all make the connection between accounting and this website. I forever have clients sending me their bank statements in PDF format, which are quite frankly useless to me and my accounting software. I need the statements in CSV format."}
          </p>

          <p>
            {"I was forever needing bank statement converters online in order to do my job, however I found it difficult to find one that consistently did an accurate job, and one that I could trust with my clients\u2019 sensitive bank statement data."}
          </p>

          <p>So, I built this site.</p>

          <p>
            {"I enjoy communicating with my site users, so please feel free to reach out on "}
            <a
              href="https://www.linkedin.com/in/ryan-vergottini-504951154"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2 transition-colors hover:text-foreground"
              style={{ color: "hsl(var(--accent))" }}
            >
              LinkedIn
            </a>
            {", or "}
            <a
              href="/contact"
              className="font-medium underline underline-offset-2 transition-colors hover:text-foreground"
              style={{ color: "hsl(var(--accent))" }}
            >
              email
            </a>
            .
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
