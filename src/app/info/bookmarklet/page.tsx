'use client'
import { useEffect, useRef } from 'react'
import { BookmarkIcon } from '@heroicons/react/24/outline'

import getUrl from '@/lib/api/getUrl'
import env from '@/lib/getEnv'

import AppLayout from '@/components/layouts/AppLayout'

export default function Page() {
  const anchorRef = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    anchorRef.current?.setAttribute('href', `javascript:(function()%7Bwindow.location.href%3D'${encodeURI(getUrl('recipe'))}%3Furl%3D'%2Bwindow.location.href%7D)()%3B`)
  }, [])

  return (
    <AppLayout withSearch className="py-4">
      <title>Bookmarklet | Reciparse</title>
      <h1 className="font-display text-3xl mb-3 text-brand-alt">Bookmarklet</h1>
      <p className="mb-4">Drag and drop the link below into your bookmarks bar. When viewing a recipe anywhere on the web, click the bookmark and you&apos;ll magically be redirected to the Recipars-ed version of the recipe!</p>
      <a ref={anchorRef} onClick={e => e.preventDefault()} className="bg-brand-alt cursor-grab active:cursor-grabbing hover:bg-brand p-4 text-white rounded transition font-semibold inline-flex group focus-visible:ring-2 focus-visible:ring-offset-2">
        <BookmarkIcon className="group-hover:fill-white transition w-5 mr-2 fill-transparent" />
        Parse recipe
        {env !== 'production' && (
          ` (${env})`
        )}
      </a>
      <p className="text-gray-500 text-sm mt-3">Drag the button above into your bookmark bar</p>
    </AppLayout>
  )
}