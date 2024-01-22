'use client'

import LogRocket from 'logrocket'
import { Button } from '@/components/ui/button'
import FixedWidth from '@/components/ui/templates/FixedWidth'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
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

  const source = searchParams.get('url')

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
      {source && <Button variant="outline" size="lg" className="mt-5">
        <Link href={source} target="_blank" className="flex gap-2 items-center">
          Go to the original site
          <ArrowTopRightOnSquareIcon className="w-5" />
        </Link>
      </Button>}
    </FixedWidth>
  )
}