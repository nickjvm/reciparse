'use client'

import { Session, createClientComponentClient} from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MyAccount() {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [session, setSession] = useState<Session|null>()
  useEffect(() => {
    const getSession = async function() {
      const { data: { session } } = await supabase.auth.getSession()
      setEmail(session?.user.email || '')
      setSession(session)
    }

    getSession()
  }, [])


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!password) {
      setMessage('Enter your current password to update your profile.')
    } else if (!email) {
      setMessage('Email address is required.')
    } else {
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: session?.user.email || '',
          password: password
        })

        if (signInError) {
          throw signInError
        }

        const { error: updateError } = await supabase.auth.updateUser({
          email,
          password: newPassword || undefined,
        }, {
          emailRedirectTo: `${location.origin}/auth/callback?dest=/account/confirm`,
        })

        if (updateError) {
          throw updateError
        }
        if (session?.user.email !== email) {
          setMessage('Check your email to confirm and complete your address change')
        } else {
          setMessage('Profile updated!')
        }
        router.refresh()
      } catch (e) {
        setMessage((e as Error)?.message || 'Something went wrong. Please try again.')
      }
    }
  }

  return (
    <form className="max-w-md mx-auto px-4 md:px-0 py-5" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-display text-center mb-5 text-brand-alt">My Account</h2>
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email Address<sup className="text-red-500 pl-0.5 -vertical-align-2">*</sup>
        </label>
        <div className="mt-2 mb-4">
          <input
            id="email"
            name="email"
            type="email"
            autoFocus
            required
            onChange={e => setEmail(e.target.value)}
            value={email}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
            tabIndex={2}
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
          Current Password<sup className="text-red-500 pl-0.5 -vertical-align-2">*</sup>
        </label>
        <div className="mt-2 mb-4">
          <input
            id="password"
            name="password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
            tabIndex={2}
          />
        </div>
      </div>
      <div>
        <label htmlFor="new_password" className="block text-sm font-medium leading-6 text-gray-900">
          Change Password
        </label>
        <p className="text-xs text-slate-500">Leave blank if you do not want to change your password.</p>
        <div className="mt-2 mb-4">
          <input
            id="new_password"
            name="new_password"
            type="password"
            onChange={e => setNewPassword(e.target.value)}
            value={newPassword}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
            tabIndex={2}
          />
        </div>
      </div>
      <button type="submit" className="transition flex w-full justify-center rounded-md bg-brand-alt px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-alt">
        Save changes
      </button>
      {message  && <div className="text-center mt-5">{message}</div>}
    </form>
  )
}