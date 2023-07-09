'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, FormEvent } from "react"
import Modal from "./Modal"
import SignIn from "./SignIn"
import Link from "next/link"
import { useAuthContext } from '@/context/AuthContext'

function AuthBtn() {
  const supabase = createClientComponentClient()
  const { user, userLoading } = useAuthContext()
  const [open, setOpen] = useState(false)

  const handleSubmit = async (values: { email: string, password: string}, e: FormEvent) => {
    e.preventDefault()

    await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    setOpen(false)
  }

  if (userLoading) {
    return null
  }
  return (
    <>
      {!user && <button className="text-sm font-semibold leading-6 text-gray-900" onClick={() => setOpen(true)}>Log In</button>}
      {user && <Link href="/account" className="text-sm font-semibold leading-6 text-gray-900">My Account</Link>}
      <Modal open={open} onClose={() => setOpen(false)}>
        <SignIn action="signin" onSubmit={handleSubmit} />
      </Modal>
    </>
  )
}

export default AuthBtn