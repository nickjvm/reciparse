'use server'

import createSupabaseServerClient from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUpWithEmailAndPassword(data: {
	email: string;
	password: string;
	confirm: string;
}) {
  const supabase = await createSupabaseServerClient()

  const result = await supabase.auth.signUp(({ email: data.email, password: data.password }))
  return JSON.stringify(result)
}

export async function signInWithEmailAndPassword(data: {
	email: string;
	password: string;
}) {
  const supabase = await createSupabaseServerClient()

  const result = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
  return JSON.stringify(result)
}

export async function handleSignOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()

  redirect('/auth-server-action')
}