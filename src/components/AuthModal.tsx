import { useAuthContext } from '@/context/AuthContext'
import Modal from './Modal'
import Image from 'next/image'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { AuthError } from '@supabase/supabase-js'

interface Props {
  authType?: string|null
}

export default function AuthModal({ authType: defaultAuthType }: Props) {
  const { user, authType, setAuthType, actions } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<AuthError|null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPassword('')
    setEmail('')
  }, [authType])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    switch (e.target.name) {
      case 'email': {
        setEmail(e.target.value)
        break
      }
      case 'password': {
        setPassword(e.target.value)
        break
      }
    }
  }

  useEffect(() => {
    setAuthType(defaultAuthType)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    let action
    let next = null
    setLoading(true)

    switch (authType) {
      case 'signin': {
        action = await actions.signIn({ email, password })
        break
      }
      case 'signout': {
        action = await actions.signOut()
        break
      }
      case 'signup': {
        action = await actions.signUp({ email, password })
        break
      }
      case 'reset': {
        action = await actions.reset(email)
        if (!action.error) {
          next = 'reset_sent'
        }
        break
      }
      default: {
        action = await Promise.resolve({ error: null })
      }
    }

    setLoading(false)
    console.log(action)
    const { error } = action

    if (error) {
      setError(error)
    } else {
      setAuthType?.(next)
    }

  }

  if (user) {
    // already logged in, no modal needed
    return null
  }

  return (
    <Modal
      open={!!authType}
      onClose={() => {
        setAuthType(null)
      }}
    >
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              width="100"
              height="100"
              className="mx-auto h-10 w-1/2"
              src="./logo.svg"
              alt="Reciparse"
            />
            <h2 className="mt-8 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
              {authType === 'signin' && 'Sign in to your account' }
              {authType === 'signup' && 'Create an account'}
              {authType === 'reset' && 'Reset your password'}
              {authType === 'reset_sent' && 'Reset email sent!'}
            </h2>
          </div>

          {authType === 'reset_sent' && (
            <p className="text-sm mt-2">If an account exists for the provided email address, we sent you a link to reset your password.</p>
          )}
          {authType !== 'reset_sent' && (
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      onChange={onChange}
                      value={email}
                      tabIndex={1}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {authType !== 'reset' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                      <div className="text-sm">
                        {authType === 'signin' && (
                          <button
                            type="button"
                            onClick={() => setAuthType?.('reset')}
                            tabIndex={3}
                            className="font-semibold text-brand-alt hover:text-brand"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        onChange={onChange}
                        value={password}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                        tabIndex={2}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="transition flex w-full justify-center rounded-md bg-brand-alt px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-alt"
                    tabIndex={3}
                  >
                    {authType === 'signin' && 'Sign in'}
                    {authType === 'signup' && 'Sign up'}
                    {authType === 'reset' && 'Send reset email'}
                  </button>

                  {error && <p className="text-center text-sm mt-4 font-semibold text-red-800">{error.message}</p>}
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                {authType === 'signin' && 'Don\'t have an account? '}
                {authType === 'signup' && 'Already have an account? '}
                {authType === 'reset' && 'Remembered your password? '}
                <button onClick={() => setAuthType?.(authType === 'signin' ? 'signup' : 'signin')} className="font-semibold leading-6 text-brand-alt hover:text-brand">
                  {authType === 'signin' ? 'Sign up for free.' : 'Sign in.'}
                </button>
              </p>
            </div>
          )}
        </div>
      </>
    </Modal>
  )
}