'use client'
import { Database } from '@/types/database.types'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ConfirmEmail() {
  const [error, setError] = useState<string|undefined>()
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const setSession = async () => {
      try {
        const hash = window.location.hash
        const oauthParams = new URLSearchParams(hash.substring(1))

        const { error } = await supabase.auth.setSession({
          access_token: oauthParams.get('access_token') || '',
          refresh_token: oauthParams.get('refresh_token') ||'',
        })

        if (error) {
          throw error
        }

        // TODO: notification of success
        router.push('/account')
      } catch (e) {
        setError((e as Error).message || 'something went wrong.')
      }
    }
    setSession()
  }, [])

  if (error) {
    return <h1>{error}</h1>
  }
  return null
}