'use client'
import { FormEvent, useState } from 'react'
import { AuthError } from '@supabase/gotrue-js'
import { useRouter } from 'next/navigation'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useNotificationContext } from '@/context/NotificationContext'
import supabase from '@/lib/supabaseClient'
import debug from '@/lib/debug'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const { showNotification } = useNotificationContext()

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
          message: 'Your password has been changed successfully.',
          variant: 'success',
          timeout: 5000
        })
      }
    } catch (err) {
      debug(err)
      if (err instanceof AuthError || err instanceof Error) {
        setError(err?.message || 'Something went wrong. Please try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
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
            onInput={() => setError('')}
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
      {error && <div className="text-red-700 text-sm text-center mt-2 flex items-center justify-center">
        <ExclamationCircleIcon className="w-4 mr-1" />
        {error}
      </div>}
    </form>
  )
}