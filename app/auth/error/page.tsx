import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  const errorMessage = params?.error || params?.message

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMessage ? (
                <p className="text-sm text-muted-foreground">
                  {errorMessage === 'no_code' 
                    ? 'The confirmation link is invalid or has expired. Please try signing up again.'
                    : errorMessage}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  An unspecified error occurred while confirming your email.
                </p>
              )}
              
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/auth/sign-up">
                  <Button variant="outline" className="w-full">
                    Try Signing Up Again
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
