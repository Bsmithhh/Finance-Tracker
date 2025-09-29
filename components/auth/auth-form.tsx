'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Something went wrong')
          return
        }

        // Auto sign in after successful signup
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })

        if (result?.error) {
          setError('Failed to sign in after registration')
          return
        }

        router.push('/dashboard')
      } else {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })

        if (result?.error) {
          setError('Invalid email or password')
          return
        }

        router.push('/dashboard')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {mode === 'signup' ? 'Create an account' : 'Welcome back'}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === 'signup' 
                ? 'Enter your details to create your account'
                : 'Enter your credentials to sign in'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading 
                  ? (mode === 'signup' ? 'Creating account...' : 'Signing in...') 
                  : (mode === 'signup' ? 'Create account' : 'Sign in')
                }
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-600 w-full">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="font-semibold text-primary hover:underline">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
                    Sign up
                  </Link>
                </>
              )}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}