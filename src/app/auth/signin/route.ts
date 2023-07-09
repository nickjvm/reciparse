import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  const body = await req.json()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      })
      if (error) {
        throw error
      }

      console.log(data)

      return NextResponse.json(data)

    } catch (err) {
      return NextResponse.json(err)
    }
  }

  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}