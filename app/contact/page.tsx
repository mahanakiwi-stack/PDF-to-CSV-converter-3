import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BackButton } from "@/components/back-button"
import { ContactForm } from "@/components/contact-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact - PDF Bank Statements to CSV",
  description:
    "Get in touch with the founder of PDF Bank Statements to CSV.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6 md:py-20">
        <BackButton />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          Have a question, feedback, or need help? Send me a message and I{"\u2019"}ll get back to you as soon as I can.
        </p>

        <div className="mt-8">
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
