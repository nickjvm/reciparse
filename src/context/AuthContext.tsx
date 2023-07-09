'use client'
import { Database } from '@/types/database.types'
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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

  return (
    <AuthContext.Provider value={{ user, userLoading: loading }}>{children}</AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
