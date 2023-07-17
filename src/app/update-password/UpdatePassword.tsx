'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useNotificationContext } from '@/context/NotificationContext'

export default function UpdatePassword() {
  const supabase = createClientComponentClient<Database>()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useSearchParams()

  const { showNotification } = useNotificationContext()

  useEffect(() => {
    const hashQuery = window.location.hash.substring(1)
    if (hashQuery || !params.get('code')) {
      const details = new URLSearchParams(window.location.hash.substring(1))
      if (details.get('error')) {
        setError(details.get('error_description') || 'Something went wrong. Please try again.')
      } else {
        setError('Something went wrong. Please try again')
      }
      setLoading(false)
    } else {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          setLoading(false)
        }
      })
      return () => authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) {
        throw error
      } else {
        router.push('/account')
        showNotification({
          title: 'Password changed.',
          message: 'Your password has been changed succesfully.',
          variant: 'success',
          timeout: 5000
        })
      }
    } catch (e) {
      setError(e as string || 'Something went wrong. Please try again.')
    }
  }

  if (loading) {
    return null
  }
  if (error) {
    return (
      <div className="max-w-xl mx-auto">
        <h2 className="text-lg font-bold mb-4 text-center">{error}</h2>
        <div className="text-center">
          <Link href="/" className="transition inline-block py-1.5 mx-auto justify-center rounded-md bg-brand-alt px-8 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-alt">Return home</Link>
        </div>
      </div>
    )
  }

  return (
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-display text-center mb-5 text-brand-alt">Reset your password</h2>
      <p className="text-center text-base mb-5">So you forgot your password - it happens to the best of us!</p>
      <div>
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
          New Password
        </label>
        <div className="mt-2 mb-4">
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            required
            onChange={e => setPassword(e.target.value)}
            value={password}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
            tabIndex={2}
          />
        </div>
      </div>
      <button type="submit" className="transition flex w-full justify-center rounded-md bg-brand-alt px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-alt">
        Update password
      </button>
    </form>
  )
}