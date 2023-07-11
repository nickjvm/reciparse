import { createServerComponentClient} from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'

import { cookies } from 'next/headers'

import request from './'

export default async function serverRequest(url: string, options: RequestInit = {}) {
  const supabase = createServerComponentClient<Database>({ cookies })

  return request(supabase, url, options)
}