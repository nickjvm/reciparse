import { Database } from '@/types/database.types'
import { SupabaseClient, createClientComponentClient, createServerComponentClient} from '@supabase/auth-helpers-nextjs'

async function request(supabase: SupabaseClient, resource: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession()

  let { headers } = options
  let finalResource = resource
  headers = new Headers(headers)

  headers.append('Content-Type', 'application/json')
  if (session) {
    headers.append('authorization', `Bearer ${session.access_token}`)
  }
  options.headers = headers

  if (resource.startsWith('/')) {
    finalResource = `${process.env.NEXT_PUBLIC_SITE_URL}${resource}`
  }

  return fetch(finalResource, options).then(r => {
    if (r.ok) {
      return r.json()
    } else {
      throw r.json()
    }
  }).catch(e => ({ error: true, message: e.message }))
}
export async function clientRequest(url: string, options?: RequestInit) {
  const supabase = createClientComponentClient<Database>()

  return request(supabase, url, options)

}

export async function serverRequest(url: string, options: RequestInit = {}) {
  const { cookies } = await import('next/headers')
  const supabase = createServerComponentClient<Database>({ cookies })

  options.next = {
    revalidate: 1
  }
  return request(supabase, url, options)
}