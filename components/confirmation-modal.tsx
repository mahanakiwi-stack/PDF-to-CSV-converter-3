'use client'

import { Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ConfirmationModalProps {
  isOpen: boolean
  email: string
  onClose: () => void
}

export function ConfirmationModal({ isOpen, email, onClose }: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-card to-card/95 border border-border/50 rounded-3xl shadow-2xl animate-in scale-in-95 duration-300 overflow-hidden">
          {/* Animated top gradient */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 animate-pulse" />
          
          <div className="p-8 space-y-8">
            {/* Success Icon with Animation */}
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse" />
                <div className="absolute inset-2 bg-emerald-500/10 rounded-full animate-in scale-in duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-in scale-in duration-700" style={{ animationDelay: '100ms' }} />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">
                Verify Your Email
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                We've sent a confirmation link to get you started
              </p>
            </div>

            {/* Email Box */}
            <div className="bg-gradient-to-br from-emerald-500/5 to-green-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-2 animate-in fade-in duration-500" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-foreground break-all">{email}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3 animate-in fade-in duration-500" style={{ animationDelay: '400ms' }}>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    <span className="text-xs font-bold text-emerald-600">1</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Check your inbox</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Look for an email from us with the subject "Confirm your signup"</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    <span className="text-xs font-bold text-emerald-600">2</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Click the link</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Open the confirmation link to verify your email address</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    <span className="text-xs font-bold text-emerald-600">3</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Start converting</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Once verified, you can immediately convert your bank statements</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '500ms' }}>
              <a
                href={`mailto:${email}`}
                rel="noopener noreferrer"
              >
                <Button className="w-full h-11 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Open Email
                </Button>
              </a>

              <Link href="/auth/login" onClick={onClose} className="block">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl font-medium border-border/30 hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all duration-200"
                >
                  Back to Login
                </Button>
              </Link>
            </div>

            {/* Info Box */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2 animate-in fade-in duration-500" style={{ animationDelay: '600ms' }}>
              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-foreground">Link expires in 24 hours</p>
                  <p className="text-xs text-muted-foreground mt-1">Make sure to verify your email within this timeframe to activate your account</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="text-center space-y-2 pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                Didn't receive the email?{' '}
                <button 
                  onClick={onClose}
                  className="font-semibold text-emerald-500 hover:text-emerald-600 transition-colors duration-200"
                >
                  Check spam
                </button>
                {' '}or{' '}
                <button 
                  onClick={onClose}
                  className="font-semibold text-emerald-500 hover:text-emerald-600 transition-colors duration-200"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
