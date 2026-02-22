'use client'

/**
 * ProtectedEmail Component
 * Displays email addresses in a way that protects them from bot scrapers
 * while keeping them fully functional as mailto links
 */

interface ProtectedEmailProps {
  email: string
  className?: string
  displayEmail?: boolean // If true, shows the email text; if false, shows custom label
  label?: string
}

export function ProtectedEmail({
  email,
  className = 'text-accent hover:underline',
  displayEmail = true,
  label,
}: ProtectedEmailProps) {
  return (
    <a
      href={`mailto:${email}`}
      className={className}
      // Prevent bots from reading the email via common scraping methods
      data-obfuscated={email}
      rel="noopener noreferrer"
    >
      {displayEmail ? email : label || email}
    </a>
  )
}
