'use client'

// Enhanced signup with duplicate email detection
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmationModal } from '@/components/confirmation-modal'
import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { Eye, EyeOff, CheckCircle2, Circle, ArrowRight, ChevronLeft } from 'lucide-react'

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'weak'
  if (password.length < 8) return 'weak'
  
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const strength = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length
  
  if (strength === 4) return 'strong'
  if (strength === 3) return 'good'
  if (strength === 2) return 'fair'
  return 'weak'
}

function PasswordStrengthBar({ strength }: { strength: PasswordStrength }) {
  const colors = {
    weak: 'from-red-500 to-red-600',
    fair: 'from-yellow-500 to-yellow-600',
    good: 'from-blue-500 to-blue-600',
    strong: 'from-green-500 to-emerald-600',
  }
  
  const widths = {
    weak: 'w-1/4',
    fair: 'w-2/4',
    good: 'w-3/4',
    strong: 'w-full',
  }
  
  const labels = {
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
  }

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${colors[strength]} transition-all duration-500 ${widths[strength]}`} />
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className={`font-semibold capitalize ${strength === 'strong' ? 'text-green-500' : strength === 'good' ? 'text-blue-500' : 'text-yellow-500'}`}>{labels[strength]}</span>
      </p>
    </div>
  )
}

function PasswordRequirements({ password }: { password: string }) {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
    { label: 'Special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {requirements.map((req, index) => (
        <div key={req.label} className="flex items-center gap-2 text-xs transition-all duration-200 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${index * 50}ms` }}>
          {req.met ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 animate-in scale-in duration-300" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
          <span className={`transition-colors duration-200 ${req.met ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            {req.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
    document.body.appendChild(script)
  }, [])

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])
  const isPasswordStrong = passwordStrength === 'strong' || passwordStrength === 'good'
  const passwordsMatch = password === repeatPassword && password.length > 0

  const isFormValid =
    fullName.trim().length > 0 &&
    email.length > 0 &&
    isPasswordStrong &&
    passwordsMatch

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!isFormValid) {
      setError('Please complete all requirements')
      setIsLoading(false)
      return
    }

    try {
      // Get reCAPTCHA token
      let recaptchaToken = ''
      if (typeof window !== 'undefined' && (window as any).grecaptcha) {
        recaptchaToken = await (window as any).grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action: 'signup' }
        )
      }

      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          recaptchaToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed')
      }

      // Migrate anonymous conversions to the new user account
      const anonSessionId = typeof window !== 'undefined' ? localStorage.getItem('anon_session_id') : null
      if (anonSessionId && data.user?.id) {
        console.log('[v0] Migrating conversions from anonymous session to user:', data.user.id)
        try {
          const migrateRes = await fetch('/api/conversions/migrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from_user_id: anonSessionId,
              to_user_id: data.user.id,
            }),
          })
          
          if (migrateRes.ok) {
            console.log('[v0] Conversions migrated successfully')
            if (typeof window !== 'undefined') {
              localStorage.removeItem('anon_session_id')
            }
          }
        } catch (err) {
          console.error('[v0] Error migrating conversions:', err)
        }
      }

      setShowConfirmation(true)
      setFullName('')
      setPassword('')
      setRepeatPassword('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-br from-background via-background to-accent/5">
      {/* Back button */}
      <Link href="/" className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      </Link>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="inline-block">
              <div className="text-4xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                Get Started
              </div>
            </div>
            <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Convert your bank statements to CSV in seconds. Smart, simple, secure.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: '200ms' }}>
                <Label htmlFor="fullName" className="text-sm font-semibold text-foreground">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ryan Vergottini"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 bg-background/50 border-border/50 focus:border-accent transition-colors duration-200 rounded-lg"
                />
              </div>

              {/* Email */}
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: '250ms' }}>
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-background/50 border-border/50 focus:border-accent transition-colors duration-200 rounded-lg"
                />
              </div>

              {/* Password */}
              <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: '300ms' }}>
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 bg-background/50 border-border/50 focus:border-accent transition-colors duration-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {password && (
                  <div className="space-y-3">
                    <PasswordStrengthBar strength={passwordStrength} />
                    <PasswordRequirements password={password} />
                  </div>
                )}
              </div>

              {/* Repeat Password */}
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: '350ms' }}>
                <Label htmlFor="repeatPassword" className="text-sm font-semibold text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="repeatPassword"
                    type={showRepeatPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="h-11 pr-10 bg-background/50 border-border/50 focus:border-accent transition-colors duration-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors duration-200"
                  >
                    {showRepeatPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {repeatPassword && !passwordsMatch && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in duration-200">
                    Passwords do not match
                  </p>
                )}
                {repeatPassword && passwordsMatch && (
                  <p className="text-xs text-green-500 flex items-center gap-1 animate-in fade-in duration-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Passwords match perfectly
                  </p>
                )}
              </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                {error.includes('already registered') ? (
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-900 text-sm">Email Already Registered</h3>
                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                          This email address is already associated with an account. Log in instead to access your account.
                        </p>
                        <Link
                          href="/auth/login"
                          className="inline-block mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors duration-200"
                        >
                          Go to Login
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-destructive/10 to-red-500/10 border border-destructive/30 p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="h-5 w-5 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-destructive">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

              {/* Terms & Privacy Agreement */}
              <p className="text-xs text-muted-foreground text-center leading-relaxed animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '400ms' }}>
                By signing up, you agree to our{' '}
                <Link href="/terms" className="hover:text-accent transition-colors duration-200 underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="hover:text-accent transition-colors duration-200 underline">
                  Privacy Policy
                </Link>
              </p>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full h-11 rounded-lg font-semibold transition-all duration-200 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '450ms' }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground mt-6 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '500ms' }}>
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-semibold hover:text-accent transition-colors duration-200"
                  style={{ color: 'hsl(var(--accent))' }}
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>256-bit encrypted</span>
            </div>
            <div className="w-px h-4 bg-border/30" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>GDPR compliant</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        email={email}
        onClose={() => {
          setShowConfirmation(false)
          setEmail('')
        }}
      />

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
