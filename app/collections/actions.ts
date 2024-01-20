'use server'

import createSupabaseServerClient from '@/lib/supabase/server'

export async function deleteCollection(id: string) {
  const supabase = await createSupabaseServerClient()


  const response = await supabase.from('collections').delete().eq('id', id)

  return response
}