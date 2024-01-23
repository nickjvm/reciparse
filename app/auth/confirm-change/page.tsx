'use client'

import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ConfirmEmailChange() {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      toast({
        variant: 'default',
        title: 'Success!',
        description: 'Your email address has been updated.'
      })
    }, 500)
    router.push('/account')
  }, [])

  return null
}