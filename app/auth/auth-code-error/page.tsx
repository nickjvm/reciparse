'use client'

import LogRocket from 'logrocket'
import { Button } from '@/components/ui/button'
import FixedWidth from '@/components/ui/templates/FixedWidth'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import env from '@/lib/getEnv'
import getUrl from '@/lib/getUrl'
import { User } from '@supabase/supabase-js'
import createSupabaseBrowserClient from '@/lib/supabase/client'


export default function AuthCodeError() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User|null>(null)

  const getUser = async () => {
    const supabase = await createSupabaseBrowserClient()

    const { data: { session } }= await supabase.auth.getSession()

    setUser(session?.user || null)
  }

  useEffect(() => {
    getUser()

    if (env === 'production') {
      LogRocket.captureException(new Error('Auth code error'), {
        extra: {
          pageName: document.title,
          url: getUrl(`${pathname}?${searchParams}`),
        }
      })
    }
  }, [])

  return (
    <FixedWidth className="max-w-xl text-center">
      <div>
        <Image className="block mb-5 mx-auto" src="/404.svg" alt="parse error" width="150" height="150" />
        <h1 className="font-display text-4xl text-primary text-center font-semibold mb-3">Something went wrong.</h1>
        <p>The link you used may have expired. Please try again.</p>
      </div>
      <Button variant="outline" size="lg" className="mt-5">
        {user ? (
          <Link href="/account">
          Go to Account
          </Link>
        ): (
          <Link href="/auth">
          Go to Login
          </Link>
        )}

      </Button>
    </FixedWidth>
  )
}