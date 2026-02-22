"use client"

import { useEffect, useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ContactLinks({ size = "sm" }: { size?: "sm" | "xs" }) {
  const [showRecaptchaModal, setShowRecaptchaModal] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const textClass = size === "xs" ? "text-[10px]" : "text-xs"
  const fontClass = "font-semibold"

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
    document.body.appendChild(script)
  }, [])

  const handleLinkedInClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    try {
      // Try to access without reCAPTCHA first
      const response = await fetch("/api/redirect/linkedin")
      const data = await response.json()

      if (response.ok && data.redirect) {
        // No rate limit hit - allow direct redirect
        window.open(data.redirect, "_blank", "noopener,noreferrer")
      } else if (response.status === 429 && data.requiresRecaptcha) {
        // Rate limit exceeded - show reCAPTCHA challenge
        setShowRecaptchaModal(true)
      } else {
        console.error("Redirect failed:", data.error)
      }
    } catch (error) {
      console.error("Error accessing LinkedIn redirect:", error)
    }
  }

  const handleRecaptchaVerify = async () => {
    setIsVerifying(true)

    try {
      if (typeof window !== "undefined" && (window as any).grecaptcha) {
        const recaptchaToken = await (window as any).grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action: "linkedin_redirect" }
        )

        // Send token to verify with backend
        const response = await fetch(`/api/redirect/linkedin?token=${recaptchaToken}`)
        const data = await response.json()

        if (response.ok && data.redirect) {
          setShowRecaptchaModal(false)
          window.open(data.redirect, "_blank", "noopener,noreferrer")
        } else {
          console.error("reCAPTCHA verification failed:", data.error)
        }
      }
    } catch (error) {
      console.error("Error verifying reCAPTCHA:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <div className={`flex items-center gap-3 ${textClass}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="#"
                onClick={handleLinkedInClick}
                className={`${fontClass} underline underline-offset-2 transition-colors hover:opacity-80 cursor-pointer`}
                style={{ color: "hsl(var(--accent))" }}
              >
                LinkedIn
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Please do not send bank statements or sensitive information</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-border">|</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/contact"
                className={`${fontClass} underline underline-offset-2 transition-colors hover:opacity-80`}
                style={{ color: "hsl(var(--accent))" }}
              >
                Email
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Please do not send bank statements or sensitive information</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* reCAPTCHA Verification Modal */}
      {showRecaptchaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-background rounded-lg p-6 shadow-xl max-w-sm mx-4 space-y-4">
            <h3 className="text-lg font-semibold">Verify to Continue</h3>
            <p className="text-sm text-muted-foreground">
              We've detected unusual activity. Please verify you're human to access LinkedIn.
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowRecaptchaModal(false)}
                disabled={isVerifying}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRecaptchaVerify}
                disabled={isVerifying}
                className="flex-1 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
