import supabase from '../supabaseClient'
import getUrl from './getUrl'
import debug from '../debug'
import timeout from '../timeout'
import recoverError from '../recoverError'

type CustomOptions = {
  multipart?: boolean
}
export default async function request(resource: string, options: RequestInit & CustomOptions = {}) {
  let accessToken = null
  if (global.window) {
    accessToken = await getAccessToken()
  }

  let { headers } = options
  let finalResource = resource
  headers = new Headers(headers)

  if (!options.multipart) {
    headers.append('Content-Type', 'application/json')
  }

  if (accessToken) {
    headers.append('authorization', `Bearer ${accessToken}`)
  }

  options.headers = headers
  delete options.multipart

  if (resource.startsWith('/')) {
    finalResource = `${getUrl()}${resource.substring(1)}`
  }

  debug('REQUEST', finalResource)

  return fetch(finalResource, options).then(async (r) => {
    let data
    try {
      data = await r.json()
    } catch (e) {
      // no json in response
    }

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

  try {
    if (accessToken && expiresAt && Date.now() < JSON.parse(expiresAt) * 1000) {
      debug('getting session from localStorage')
    } else if (accessToken) {
      debug('refreshing session');
      ({ data: { session } } = await timeout(supabase.auth.refreshSession(), 5000, 'auth_timeout_error'))
      debug('session refreshed')

      accessToken = session?.access_token
    }

    if (!accessToken && global.window) {
      debug('getting session asynchronously');
      ({ data: { session } } = await timeout(supabase.auth.getSession(), 5000, 'auth_timeout_error'))
      debug('async token retrieved')

      accessToken = session?.access_token
    }

    if (accessToken) {
      localStorage.setItem('access_token', `${session?.accessToken || accessToken}`)
      localStorage.setItem('expires_at', `${session?.expires_at || expiresAt}`)
    } else {
      localStorage.removeItem('access_token')
      localStorage.removeItem('expires_at')
    }

    return accessToken
  } catch (e) {
    if ((e as Error).message === 'auth_timeout_error') {
      recoverError()
    }
  }
}