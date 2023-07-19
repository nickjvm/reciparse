import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const dest = requestUrl.searchParams.get('dest') || ''
  const action = requestUrl.searchParams.get('action')
  const redirectURL = new URL(requestUrl.origin + dest)

  Array.from(requestUrl.searchParams).forEach(([key, value]) => {
    if (!['dest', 'action'].includes(key)) {
      redirectURL.searchParams.set(key, value)
    }
  })

  if (action) {
    cookies().set('notify', action)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(redirectURL)
}