'use server'

import readUserSession from '@/lib/actions'
import createSupabaseServerClient from '@/lib/supabase/server'

type UpdateProfileValues = {
  email: string
  password: string
  newPassword?: string
}
export async function updateUserProfile({ email, password, newPassword }: UpdateProfileValues) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error} = await readUserSession()

  if (!session?.user?.email || error) {
    return {
      data: null,
      error: {
        message: (error as Error)?.message || 'Unable to read session',
      },
      count: null,
      status: 400,
      statusText: 'ServerError'
    }
  }

  const { error: signInError, data: userVerified} = await supabase.rpc('verify_user_password', { password })

  if (signInError || !userVerified) {
    return {
      data: null,
      error: {
        message: signInError?.message || 'Incorrect password',
      }
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    email,
    password: newPassword || undefined,
  })

  if (updateError) {
    return {
      data: null,
      error: {
        message: updateError?.message || 'Unable to update profile.'
      },
    }
  }

  // await signInWithEmailAndPassword({ email, password })

  return {
    data: {
      emailChanged: email !== session?.user?.email
    },
    error: null,
  }
}