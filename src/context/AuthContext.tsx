'use client'
import { User } from '@supabase/auth-helpers-nextjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createContext, useState, useEffect, useContext, ReactNode } from 'react'

import { signIn, signOut, signUp, reset, AuthActions} from '@/lib/auth'
import supabase from '@/lib/supabaseClient'
import debug from '@/lib/debug'
import timeout from '@/lib/timeout'
import recoverError from '@/lib/recoverError'

import AuthModal from '@/components/molecules/AuthModal'

import { useNotificationContext } from './NotificationContext'
import LogRocket from 'logrocket'
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

const AuthContext = createContext<Context>({} as Context)

export function AuthContextProvider({ children }: Props) {
  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState(true)
  const [hashChecked, setHashChecked] = useState(false)
  const [authType, setAuthType] = useState<string|null|undefined>(null)
  const [destination, setDestination] = useState<string|null>(null)

  const router = useRouter()
  const { showNotification } = useNotificationContext()

  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (authType) {
      showNotification(null)
    }
  }, [authType])

  useEffect(() => {
    if (destination && pathname !== destination) {
      router.push(destination)
    }
    setDestination(null)
  }, [destination, pathname, router])

  useEffect(() => {
    const redirectHash = () => {
      if (!window.location.hash) {
        setHashChecked(true)
        return
      }

      try {
        const searchParams = new URLSearchParams(window.location.hash.substring(1))
        if (searchParams.get('access_token') && searchParams.get('type')) {
          switch (searchParams.get('type')) {
            case 'signup': {
              showNotification({
                title: 'Hello there!',
                message: 'Thanks for creating an account. Your account has been confirmed.',
                variant: 'success',
                timeout: 5000,
              })
              setDestination('/')
              break
            }
            case 'recovery': {
              setDestination('/update-password')
              break
            }
            case 'email_change': {
              showNotification({
                title: 'Success!',
                message: 'Your email address has been changed successfully.',
                variant: 'success'
              })
              setDestination('/')
              break
            }
            default:
          }
        } else if (searchParams.get('error')) {
          showNotification({
            title: 'Oops.',
            message: searchParams.get('error_description') || searchParams.get('error') || 'Something went wrong.',
            variant: 'error',
          })
          setDestination(window.location.pathname)
        }
      } catch (e) {
        debug(e)
        showNotification({
          title: 'Oops.',
          message: 'Something went wrong.',
          variant: 'error',
        })
        setDestination(window.location.pathname)
      } finally {
        setHashChecked(true)
      }
    }

    redirectHash()
    window.addEventListener('hashchange', redirectHash)

    return () => {
      window.removeEventListener('hashchange', redirectHash)
    }
  }, [])

  useEffect(() => {
    sessionStorage.removeItem('authdelay')
  }, [pathname, searchParams])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      debug(event, session)
      try {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('search_history')

          showNotification({
            title: 'See ya later!',
            message: 'You have been signed out.',
            timeout: 5000
          })

          setUser(null)
          router.refresh()
          sessionStorage.setItem('authdelay', '1')
          localStorage.removeItem('access_token')
          localStorage.removeItem('expires_at')
        } else {
          if (session) {
            // sometimes on first pageview, auth.getUser hangs and never resolves.
            // its not ideal, but if it doesn't resolve in 3 seconds, we'll trigger
            // a hard refresh of the page so supabase can try again. Second page load seems
            // to work consistently. Maybe it's an issue with the free tier of vercel and supabase
            // and starting up from a cold server if there hasn't been any activity for a while
            const { data, error } = await timeout(supabase.auth.getUser(session.access_token), 3000, 'auth_timeout_error')

            localStorage.setItem('access_token', session.access_token)
            localStorage.setItem('expires_at', `${session.expires_at}`)
            if (data?.user && data?.user.id !== user?.id) {
              setUser(data.user)
              debug(event, data.user)
              LogRocket.identify(data.user.email)

              if (event === 'SIGNED_IN') {
                router.refresh()
              }
            } else if (error) {
              throw error
            }
          }
        }
      } catch (e) {
        debug(e)
        setUser(null)
        if ((e as Error).message === 'auth_timeout_error') {
          recoverError()
        }
      } finally {
        setLoading(false)
        // router.refresh()
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  debug({ loading, hashChecked, destination })

  return (
    <AuthContext.Provider
      value={{
        user,
        userLoading: loading || !hashChecked || !!destination,
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
