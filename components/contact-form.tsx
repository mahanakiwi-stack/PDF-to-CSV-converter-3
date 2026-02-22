"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
    document.body.appendChild(script)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    setErrorMessage("")

    try {
      // Get reCAPTCHA token
      let recaptchaToken = ""
      if (typeof window !== "undefined" && (window as any).grecaptcha) {
        recaptchaToken = await (window as any).grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action: "submit_contact" }
        )
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, recaptchaToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message.")
      }

      setStatus("sent")
      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      )
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}
        >
          <CheckCircle2
            className="h-6 w-6"
            style={{ color: "hsl(var(--accent))" }}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Message sent
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {"Thanks for reaching out! I\u2019ll get back to you as soon as I can."}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setStatus("idle")}
          className="mt-2"
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-card-foreground">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={status === "sending"}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "sending"}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-card-foreground">
          Message
        </Label>
        <textarea
          id="message"
          placeholder="How can I help?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={status === "sending"}
          rows={5}
          maxLength={5000}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="text-right text-[10px] text-muted-foreground">
          {message.length}/5000
        </p>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={status === "sending" || !name || !email || !message}
        className="w-full gap-2 rounded-xl shadow-sm"
        style={{
          backgroundColor: "hsl(var(--accent))",
          color: "hsl(var(--accent-foreground))",
        }}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send message"
        )}
      </Button>

      <p className="text-center text-[10px] text-muted-foreground/60">
        Please do not send bank statements or sensitive information via this
        form.
      </p>
    </form>
  )
}
