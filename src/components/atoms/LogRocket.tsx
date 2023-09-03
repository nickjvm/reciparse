'use client'
import LogRocket from 'logrocket'
import { useEffect } from 'react'
import env from '@/lib/getEnv'

export default function LogRocketInit() {
  useEffect(() => {
    if (env === 'production' && typeof window !== 'undefined') {
      LogRocket.init('lpicpm/reciparse')
    }
  }, [])
  return null
}