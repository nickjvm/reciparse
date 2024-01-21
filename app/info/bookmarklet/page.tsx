'use client'
import { useEffect, useRef } from 'react'
import { BookmarkIcon } from '@heroicons/react/24/outline'

import getUrl from '@/lib/getUrl'
import env from '@/lib/getEnv'
import Heading from '@/components/ui/atoms/Heading'
import { Button } from '@/components/ui/button'
import FixedWidth from '@/components/ui/templates/FixedWidth'

export default function Page() {
  const anchorRef = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    anchorRef.current?.setAttribute('href', `javascript:(function()%7Bwindow.location.href%3D'${encodeURI(getUrl('recipe'))}%3Furl%3D'%2Bwindow.location.href%7D)()%3B`)
  }, [])

  return (
    <FixedWidth>
      <title>Bookmarklet | Reciparse</title>
      <Heading>Bookmarklet</Heading>
      <p className="mb-4">Drag and drop the link below into your bookmarks bar. When viewing a recipe anywhere on the web, click the bookmark and you&apos;ll magically be redirected to the Recipars-ed version of the recipe!</p>
      <Button size="lg">
        <a ref={anchorRef} onClick={e => e.preventDefault()} className="flex gap-3" >
          <BookmarkIcon className="group-hover:fill-white transition w-5 mr-2 fill-transparent" />
        Parse recipe
          {env !== 'production' && (
            ` (${env})`
          )}
        </a>
      </Button>
      <p className="text-gray-500 text-sm mt-3">Drag the button above into your bookmark bar</p>
    </FixedWidth>
  )
}