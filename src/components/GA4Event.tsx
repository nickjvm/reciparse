'use client'

import gtag from '@/lib/gtag'
import { useEffect } from 'react'

interface Props {
  name: string
  properties: {
    [key:string]: string|number
  }
}

export default function GA4Event({ name, properties = {} }: Props) {
  useEffect(() => {
    gtag(name, properties)
  }, [])

  return null
}