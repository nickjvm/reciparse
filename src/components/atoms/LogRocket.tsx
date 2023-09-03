'use client'
import LogRocket from 'logrocket'
import { useEffect } from 'react'
import env from '@/lib/getEnv'
import { useAuthContext } from '@/context/AuthContext'

export default function LogRocketInit() {
  const { user } = useAuthContext()

  useEffect(() => {
    if (env === 'production' && typeof window !== 'undefined') {
      LogRocket.init('lpicpm/reciparse')
      if (user?.email) {
        LogRocket.identify(user.email)
      }
    }
  }, [user])
  return null
}