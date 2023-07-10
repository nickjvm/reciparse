import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { AuthAction } from '@/types'
import { AuthError } from '@supabase/supabase-js'

interface Values {
  email: string
  password: string
  action: AuthAction
}

interface Props {
  action: AuthAction
  onSubmit: (value: Values, e: FormEvent) => void
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onActionChange?: (action: AuthAction) => void,
  disabled: boolean
  error?: AuthError|null
}

export default function SignIn({ action: _action = 'signin', onSubmit, onChange: _onChange, onActionChange, disabled, error }: Props) {
  const [action, setAction] = useState<AuthAction>(_action)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    onActionChange?.(action)
    setPassword('')
    setEmail('')
  }, [action])
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    _onChange?.(e)

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
    setAction(_action)
  }, [_action])

  return (
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
            {action === 'signin' && 'Sign in to your account' }
            {action === 'signup' && 'Create an account'}
            {action === 'reset' && 'Reset your password'}
            {action === 'reset_sent' && 'Reset email sent!'}
          </h2>
        </div>

        {action === 'reset_sent' && (
          <p className="text-sm mt-2">If an account exists for the provided email address, we sent you a link to reset your password.</p>
        )}
        {action !== 'reset_sent' && (
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={e => onSubmit({ email, password, action }, e)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
                </label>
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

              {action !== 'reset' && (
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="text-sm">
                      {action === 'signin' && (
                        <button type="button" onClick={() => setAction('reset')} tabIndex={3} className="font-semibold text-brand-alt hover:text-brand">
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
                  disabled={disabled}
                  className="transition flex w-full justify-center rounded-md bg-brand-alt px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-alt"
                  tabIndex={3}
                >
                  {action === 'signin' && 'Sign in'}
                  {action === 'signup' && 'Sign up'}
                  {action === 'reset' && 'Send reset email'}
                </button>

                {error && <p className="text-center text-sm mt-4 font-semibold text-red-800">{error.message}</p>}
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              {action === 'signin' && 'Don\'t have an account? '}
              {action === 'signup' && 'Already have an account? '}
              {action === 'reset' && 'Remembered your password? '}
              <button onClick={() => setAction(action === 'signin' ? 'signup' : 'signin')} className="font-semibold leading-6 text-brand-alt hover:text-brand">
                {action === 'signin' ? 'Sign up for free.' : 'Sign in.'}
              </button>
            </p>
          </div>
        )}
      </div>
    </>
  )
}
