import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AuthError, User } from '@supabase/supabase-js'

const supabase = createClientComponentClient()

interface Payload {
  email: string
  password: string
}

interface AuthUserResponse {
  user: User|null,
  error: AuthError|null
}

export interface AuthActions {
    signIn: ({ email, password }: Payload) => Promise<AuthUserResponse>
    signUp: ({ email, password }: Payload) => Promise<AuthUserResponse>
    signOut: () => (Promise<{ error: AuthError|null }>)
    reset: (email: string) =>(Promise<{ data: {}|null, error: AuthError|null }>)
}

export const signIn = async ({ email, password }: Payload): Promise<{ user: User|null, error: AuthError|null}> => {
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return {
    user,
    error,
  }
}

export const signUp = async ({ email, password }: Payload) => {
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${location.origin}/auth/callback`,
    }
  })

  const { data: { user } } = response
  let { error } = response

  if (!error && !user?.identities?.length) {
    (error = new AuthError('Account already exists for this email address.', 409))
  }

  return {
    user,
    error
  }
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const reset = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/auth/callback?dest=/update-password`,
  })

  return {
    data,
    error,
  }
}