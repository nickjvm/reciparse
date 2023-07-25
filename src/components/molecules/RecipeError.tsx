'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

import request from '@/lib/api'
import getUrl from '@/lib/api/getUrl'

interface Props {
  actionUrl?: string | null
  actionText?: string
  errorText?: string
  errorTitle?: string
  image?: string
  className?: string
  type?: string
  url?: string
  details?: {
    message: string
  }
}

export default function RecipeError({
  actionUrl,
  actionText,
  errorText = 'Something went wrong.',
  errorTitle = 'Shoot.',
  image = '/404.svg',
  type,
  url,
  className,
  details,
}: Props) {
  const external = actionUrl && actionUrl.startsWith('http')
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (type) {
      const params = searchParams.toString()
      request('/api/system/log', {
        method: 'POST',
        body: JSON.stringify({
          type,
          url: url || getUrl(`${pathname}${params ? `?${params}` : ''}`),
          details,
        })
      })
    }
  }, [])

  return (
    <div className={className}>
      <div className="grid grid-cols-12 items-center">
        <div className="col-span-12 sm:col-span-7 order-1 sm:order-0">
          <h2 className="text-brand-alt font-display text-4xl mb-4">{errorTitle}</h2>
          <p className="text-xl">{errorText || 'We tried our best, but couldn\'t find what you were looking for.'}</p>
          {actionUrl && actionText && (
            <Link
              className="text-center font-semibold block sm:inline-block mt-5 py-3 px-4 text-base bg-brand-alt hover:bg-brand focus-visible:bg-brand text-white transition rounded "
              href={actionUrl}
              target={external ? 'blank' : ''}
            >
              {actionText}
              {external && <ArrowTopRightOnSquareIcon className="inline ml-2 w-5 -mt-1" />}
            </Link>
          )}
        </div>
        <div className="col-span-12 sm:col-span-4 sm:col-start-9 order-0 sm:order-1">
          <Image className="m-auto block max-w-[75%] sm:max-w-full w-full mb-4 sm:mb-0" width="100" height="100" src={image} alt={errorTitle}/>
        </div>
      </div>
    </div>
  )
}
