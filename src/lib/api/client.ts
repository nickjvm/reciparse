'use client'
import { createClientComponentClient} from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'

import request from './'

export default async function clientRequest(url: string, options?: RequestInit) {
  const supabase = createClientComponentClient<Database>()

  return request(supabase, url, options)
}