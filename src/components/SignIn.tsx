import { FormEvent, useState } from 'react'
import Image from "next/image";

interface Values {
  email: string
  password: string
}
interface Props {
  action: 'signin'|'signup'
  onSubmit: (value: Values, e: FormEvent) => void
}
export default function SignIn({ action: _action = 'signin', onSubmit }: Props) {
  const [action, setAction] = useState<string>(_action)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


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
            {action === 'signin' ? 'Sign in to your account' : 'Create an account'}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="/auth/signin" method="POST" onSubmit={e => onSubmit({ email, password }, e)}>
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
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  tabIndex={1}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  {action === 'signin' && (
                    <a href="#" tabIndex={3} className="font-semibold text-brand-alt hover:text-brand">
                      Forgot password?
                    </a>
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
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                  tabIndex={2}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="transition flex w-full justify-center rounded-md bg-brand-alt px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-alt"
                tabIndex={3}
              >
                {action === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {action === 'signin' ? 'Don\'t have an account? ' : 'Already have an account? '}
            <button onClick={() => setAction(action === 'signin' ? 'signup' : 'signin')} className="font-semibold leading-6 text-brand-alt hover:text-brand">
              {action === 'signin' ? 'Sign up for free.' : 'Sign in.'}
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
