import supabase from '../supabaseClient'
import getUrl from './getUrl'
import debug from '../debug'
import timeout from '../timeout'
import recoverError from '../recoverError'

export default async function request(resource: string, options: RequestInit = {}) {
  let accessToken = null
  if (global.window) {
    accessToken = await getAccessToken()
  }

  let { headers } = options
  let finalResource = resource
  headers = new Headers(headers)

  headers.append('Content-Type', 'application/json')
  if (accessToken) {
    headers.append('authorization', `Bearer ${accessToken}`)
  }

  options.headers = headers

  if (resource.startsWith('/')) {
    finalResource = `${getUrl()}${resource.substring(1)}`
  }

  debug('REQUEST', finalResource)

  return fetch(finalResource, options).then(async (r) => {
    const data = await r.json()
    if (r.ok) {
      return {
        data,
        error: null,
      }
    } else {
      return {
        data: null,
        error: data,
      }
    }
  })
}

export const getAccessToken = async () => {
  const expiresAt = localStorage.getItem('expires_at')
  let accessToken:string|undefined|null = localStorage.getItem('access_token')
  let session

  if (expiresAt && Date.now() < JSON.parse(expiresAt) * 1000) {
    debug('getting session from localStorage')
  } else {
    accessToken = null
  }

  if (!accessToken && global.window) {
    try {
      debug('getting session asynchronously');

      ({ data: { session } } = await timeout(supabase.auth.getSession(), 5000, 'auth_timeout_error'))
    } catch (e) {
      if ((e as Error).message === 'auth_timeout_error') {
        recoverError()
      }
    }
  }

  if (accessToken) {
    localStorage.setItem('access_token', `${accessToken}`)
    localStorage.setItem('expires_at', `${session?.expires_at || expiresAt}`)
  } else {
    localStorage.removeItem('access_token')
    localStorage.removeItem('expires_at')
  }

  return accessToken
}