import { Resend } from "resend"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { headers } from "next/headers"

const resend = new Resend(process.env.RESEND_API_KEY)

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "contact-form",
})

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headersList.get("x-real-ip") ??
      "unknown"

    // Rate limit: 3 contact form submissions per hour per IP
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return Response.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { name, email, message, recaptchaToken } = body

    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA token
    if (recaptchaToken) {
      try {
        const recaptchaResponse = await fetch(
          "https://www.google.com/recaptcha/api/siteverify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
          }
        )

        const recaptchaData = await recaptchaResponse.json()

        // Check if reCAPTCHA verification was successful
        if (!recaptchaData.success || recaptchaData.score < 0.5) {
          return Response.json(
            { error: "reCAPTCHA verification failed. Please try again." },
            { status: 400 }
          )
        }
      } catch (error) {
        console.error("reCAPTCHA verification error:", error)
        return Response.json(
          { error: "Failed to verify reCAPTCHA. Please try again." },
          { status: 400 }
        )
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email address." }, { status: 400 })
    }

    // Limit message length
    if (message.length > 5000) {
      return Response.json(
        { error: "Message is too long. Maximum 5000 characters." },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: "PDF Bank Statements to CSV <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `Contact form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return Response.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    )
  }
}
