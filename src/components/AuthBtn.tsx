'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, FormEvent } from "react"
import Modal from "./Modal"
import SignIn from "./SignIn"
import Link from "next/link"
import { useAuthContext } from '@/context/AuthContext'
import { Popover } from '@headlessui/react'
import { HeartIcon, UserIcon, ArrowLeftOnRectangleIcon} from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { AuthAction } from '@/types'

function AuthBtn() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user, userLoading } = useAuthContext()
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<AuthAction>('signin')

  const handleSubmit = async (values: { email: string, password: string, action: AuthAction}, e: FormEvent) => {
    e.preventDefault()
    if (values.action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      console.log(values.action, { data, error })
      if (!error) {
        setOpen(false)
        router.refresh()
      }
    } else if (values.action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        }
      })
      console.log(values.action, { data, error })
      if (!error) {
        setOpen(false)
        router.refresh()
      }
    } else if (values.action === 'reset') {
      const { data, error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${location.origin}/auth/callback?dest=/update-password`,
      })
      setAction('reset_sent')
      console.log(values.action, { data, error })
    }

  }

  const handleSignOut = async () => {
    supabase.auth.signOut()
    router.push('/')
  }

  if (userLoading) {
    return null
  }

  if (!user) {
    return (
      <>
        <button className="text-sm font-semibold leading-6 text-gray-900" onClick={() => setOpen(true)}>Log In</button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <SignIn action={action} onSubmit={handleSubmit} />
        </Modal>
      </>
    )
  } else {
    return (
      <>
        <Popover className="relative">
          <>
            <Popover.Button className="text-sm font-semibold leading-6 text-gray-900">
              My Account
            </Popover.Button>

            <Popover.Panel className="text-sm font-semibold leading-6 shadow absolute mt-2 bg-white right-0 rounded w-40 min-w-fit whitespace-nowrap">
              <Link href="/account/favorites" className="block hover:bg-slate-100 px-3 py-2">
                <HeartIcon className="w-5 inline-block mr-2" />
                My Favorites
              </Link>
              <Link href="/account" className="block hover:bg-slate-100 px-3 py-2">
                <UserIcon className="w-5 inline-block mr-2"/>
                My Profile
              </Link>
              <button className="w-full text-left block hover:bg-slate-100 px-3 py-2" type="submit" onClick={handleSignOut}>
                <ArrowLeftOnRectangleIcon className="w-5 inline-block mr-2"/>
                Sign out
              </button>
            </Popover.Panel>
          </>
        </Popover>
      </>
    )
  }
}

export default AuthBtn