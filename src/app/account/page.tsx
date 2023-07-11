'use client'

import { createClientComponentClient} from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import withHeader from '@/components/withHeader'
import { FormEvent, useEffect, useState } from 'react'

function Page() {
  const supabase = createClientComponentClient<Database>()

  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const getSession = async function() {
      const { data } = await supabase.auth.getSession()
      console.log(data)
      setEmail(data.session?.user.email || '')
      return data
    }

    getSession()
  }, [])


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.updateUser({
        email,
        password: password || undefined,
      }, {
        emailRedirectTo: `${location.origin}/auth/callback`,
      })
      console.log(data, error)
      if (error) {
        throw error
      } else {
        setMessage('Profile updated!')
      }
    } catch (e) {
      setMessage(e as string || 'Something went wrong. Please try again.')
    }
  }
  return (
    <form className="max-w-md mx-auto px-4 md:px-0 py-5" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-display text-center mb-5 text-brand-alt">My Account</h2>
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email Address
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
          Change Password
        </label>
        <div className="mt-2 mb-4">
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            onChange={e => setPassword(e.target.value)}
            value={password}
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

export default withHeader(Page, { withSearch: false })