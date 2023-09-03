'use client' // Error components must be Client Components

import { useEffect } from 'react'
import LogRocket from 'logrocket'

import env from '@/lib/getEnv'
import RecipeError from '@/components/molecules/RecipeError'

export default function Error({error}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
    if (env === 'production') {
      LogRocket.captureException(error, {
        extra: {
          pageName: document?.title || 'Unknown page',
        },
      })
    }
  }, [error])

  return (
    <div className="max-w-xl mx-auto flex items-center min-h-screen">
      <RecipeError type="critical" details={error} />
    </div>
  )
}