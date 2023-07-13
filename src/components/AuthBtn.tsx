'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, FormEvent } from 'react'
import Modal from './Modal'
import SignIn from './SignIn'
import Link from 'next/link'
import { useAuthContext } from '@/context/AuthContext'
import { Popover } from '@headlessui/react'
import { HeartIcon, UserIcon, ArrowLeftOnRectangleIcon} from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { AuthAction } from '@/types'
import { AuthError } from '@supabase/supabase-js'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'

interface Props {
  onSuccess?: () => void
}
function AuthBtn({ onSuccess }: Props) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user } = useAuthContext()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<AuthAction>('signin')
  const [error, setError] = useState<AuthError|null>()

  const handleSubmit = async (values: { email: string, password: string, action: AuthAction}, e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (values.action === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      setLoading(false)
      if (error) {
        setError(error)
      } else {
        setOpen(false)
        onSuccess?.()
        router.refresh()
        // @TODO: notification toaster?
      }
    } else if (values.action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        }
      })
      setLoading(false)
      if (error) {
        setError(error)
      } else {
        if (data.user?.identities?.length) {
          setOpen(false)
          router.refresh()
          onSuccess?.()
        } else {
          setError(new AuthError('Account already exists for this email address.', 401))
        }
        // @TODO: notification toaster?
      }
    } else if (values.action === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${location.origin}/auth/callback?dest=/update-password`,
      })
      setLoading(false)
      if (error) {
        setError(error)
      } else {
        setAction('reset_sent')
      }
    }
  }

  const handleSignOut = async () => {
    supabase.auth.signOut()
    router.push('/')
    setOpen(false)
  }

  const handleChange = () => {
    setError(null)
  }

  if (!user) {
    return (
      <>
        <button onClick={() => {setOpen(true)}}>Log In</button>
        <Modal open={open} onClose={() => {
          setOpen(false)
          setAction('signin')
          setError(null)
          setLoading(false)
        }}>
          <SignIn
            action={action}
            disabled={loading}
            onSubmit={handleSubmit}
            error={error}
            onChange={handleChange}
            onActionChange={() => setError(null)}
          />
        </Modal>
      </>
    )
  } else {
    return (
      <>
        <div className="hidden whitespace-nowrap md:block">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button className={classNames(
                  'transition flex items-center text-sm font-semibold leading-6 text-gray-900 hover:bg-slate-50 hover:ring-slate-200 hover:ring-1 focus-visible:bg-slate-50 py-1.5 px-2 -py-1.5 rounded',
                  open && 'ring-1 bg-slate-50, ring-slate-200'
                )}>
                  <span className="sr-only">My Account</span>
                  <span className="inline-block h-7 w-7 overflow-hidden rounded-full bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <ChevronDownIcon className="w-4 stroke-gray-500 ml-3"/>
                </Popover.Button>

                <Popover.Panel className="transition text-sm font-semibold leading-6 shadow absolute mt-2 bg-white right-0 rounded w-40 min-w-fit whitespace-nowrap">
                  <Link href="/account/favorites" className="block hover:bg-slate-50 px-3 py-2">
                    <HeartIcon className="w-5 inline-block mr-2" />
                    My Favorites
                  </Link>
                  <Link href="/account" className="transition block hover:bg-slate-50 px-3 py-2">
                    <UserIcon className="w-5 inline-block mr-2"/>
                    My Profile
                  </Link>
                  <button className="transition w-full text-left block hover:bg-slate-50 px-3 py-2" type="submit" onClick={handleSignOut}>
                    <ArrowLeftOnRectangleIcon className="w-5 inline-block mr-2"/>
                    Sign out
                  </button>
                </Popover.Panel>
              </>
            )}
          </Popover>
        </div>
        <div className="md:hidden space-y-1">
          <Link href="/account/favorites" className="block md:hover:bg-slate-100 py-2">
            <HeartIcon className="w-5 inline-block mr-2" />
            My Favorites
          </Link>
          <Link href="/account" className="block md:hover:bg-slate-100 py-2">
            <UserIcon className="w-5 inline-block mr-2"/>
            My Profile
          </Link>
          <button className="w-full text-left block md:hover:bg-slate-100 py-2" type="submit" onClick={handleSignOut}>
            <ArrowLeftOnRectangleIcon className="w-5 inline-block mr-2"/>
            Sign out
          </button>
        </div>
      </>
    )
  }
}

export default AuthBtn