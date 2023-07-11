import { SupabaseClient} from '@supabase/auth-helpers-nextjs'

function getUrl() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000'

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`

  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

  return url
}

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