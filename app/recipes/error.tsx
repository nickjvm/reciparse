'use client'

import LogRocket from 'logrocket'
import { Button } from '@/components/ui/button'
import FixedWidth from '@/components/ui/templates/FixedWidth'
import env from '@/lib/getEnv'
import getUrl from '@/lib/getUrl'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

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
        <h1 className="font-display text-4xl text-primary text-center font-semibold mb-3">Recipe Not Found</h1>
        <p>We searched high and low, but couldn&apos;t find all of the information we needed to parse the recipe.</p>
      </div>
      <Button variant="outline" className="mt-5" size="lg" onClick={reset}>Retry</Button>
    </FixedWidth>
  )
}