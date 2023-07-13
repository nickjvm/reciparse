import { SupabaseClient} from '@supabase/auth-helpers-nextjs'
import getUrl from './getUrl'



export default async function request(supabase: SupabaseClient, resource: string, options: RequestInit = {}) {
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
    finalResource = `${getUrl()}${resource.substring(1)}`
  }

  console.log('REQUEST', finalResource)

  return fetch(finalResource, options).then(r => {
    if (r.ok) {
      return r.json()
    } else {
      throw r.json()
    }
  }).catch(e => ({ error: true, message: e.message }))
}