'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface Props {
  callback: (url: string) => void
}
export function OnNavigation({ callback }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log(url)
    callback(url)
  }, [pathname, searchParams])

  return null
}