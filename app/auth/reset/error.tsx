'use client'

import LogRocket from 'logrocket'
import { Button } from '@/components/ui/button'
import FixedWidth from '@/components/ui/templates/FixedWidth'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import env from '@/lib/getEnv'
import getUrl from '@/lib/getUrl'

type Props = {
  error: Error;
  reset: () => void;
}

export default function Error({ error }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log(error)

    if (env === 'production') {
      LogRocket.captureException(error, {
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
        <p>The reset link you used may have expired. Please try again.</p>
      </div>
      <Button variant="outline" size="lg" className="mt-5">
        <Link href="/auth/forgot">
          Retry
        </Link>
      </Button>
    </FixedWidth>
  )
}