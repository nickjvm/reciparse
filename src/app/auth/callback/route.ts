import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function GET(request: NextRequest) {
  console.log(request.url)
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const dest = requestUrl.searchParams.get('dest') || ''
  console.log(code, dest)
  const redirectURL = new URL(requestUrl.origin + dest)

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
    redirectURL.searchParams.set('code', code)
  }


  // URL to redirect to after sign in process completes
  return NextResponse.redirect(redirectURL)
}