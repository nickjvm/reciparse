'use client'

import LogRocket from 'logrocket'

import { Button } from '@/components/ui/button'
import FixedWidth from '@/components/ui/templates/FixedWidth'
import Image from 'next/image'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import getUrl from '@/lib/getUrl'
import env from '@/lib/getEnv'

type Props = {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
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
        <h1 className="font-display text-4xl text-primary text-center font-semibold mb-3">Something Went Wrong</h1>
        <p>Sorry for the inconvenience. We&apos;ve made a note of the problem and hope to have it fixed soon!</p>
      </div>
      <Button variant="outline" className="mt-5" size="lg" onClick={reset}>Retry</Button>
    </FixedWidth>
  )
}