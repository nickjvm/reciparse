'use client'
import { Database } from '@/types/database.types'
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useState, useEffect, useContext, ReactNode } from 'react'

interface Context {
  user: null | User
  userLoading: boolean
}

interface Props {
  children: ReactNode
  user: User | null
}

const AuthContext = createContext<Context>({
  user: null,
  userLoading: true,
})

export function AuthContextProvider({ children, user: serverUser}: Props) {
  const supabase = createClientComponentClient<Database>()
  const [user, setUser] = useState<User|null>(serverUser)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_OUT') {
          setUser(null)
        } else {
          if (session) {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (user) {
              setUser(user)
            } else if (error) {
              throw error
            }
          }
        }
      } catch (e) {
        console.error(e)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      console.log('refreshing session.')
      const { data: { session },  error } = await supabase.auth.refreshSession()
      if (error) {
        router.push('/')
      } else {
        console.log('setting session!')
        await supabase.auth.setSession({
          access_token: session?.access_token || '',
          refresh_token: session?.refresh_token || '',
        })
      }
    }, 10 * 60 * 1000)

    // clean up setInterval
    return () => clearInterval(handle)
  }, [])

  return (
    <AuthContext.Provider value={{ user, userLoading: loading }}>{children}</AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
