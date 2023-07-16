'use client'
import { Database } from '@/types/database.types'
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { signIn, signOut, signUp, reset, AuthActions} from '@/lib/auth'
import AuthModal from '@/components/AuthModal'
import { useNotificationContext } from './NotificationContext'

interface Context {
  user: null | User
  userLoading: boolean
  actions: AuthActions
  authType?: string|null
  setAuthType: (type?: string|null) => void
}

interface Props {
  children: ReactNode
  user: User | null
}

const AuthContext = createContext<Context>({
  user: null,
  userLoading: true,
  actions: {
    signIn,
    signUp,
    signOut,
    reset,
  },
  setAuthType: (type: string|null|undefined) => {
    console.log('noop', type)
  }
})

export function AuthContextProvider({ children, user: serverUser}: Props) {
  const supabase = createClientComponentClient<Database>()
  const [user, setUser] = useState<User|null>(serverUser)
  const [loading, setLoading] = useState(false)
  const [authType, setAuthType] = useState<string|null|undefined>(null)
  const router = useRouter()
  const { showNotification } = useNotificationContext()

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_OUT') {
          router.push('/')
          setUser(null)
          router.refresh()
          showNotification({
            title: 'See ya later!',
            message: 'You have been signed out.',
            timeout: 5000
          })
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
        router.push('/')
      } finally {
        setLoading(false)
      }
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        userLoading: loading,
        actions: {
          signIn,
          signUp,
          signOut,
          reset,
        },
        authType,
        setAuthType,
      }}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
