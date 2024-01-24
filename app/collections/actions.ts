'use server'

import createSupabaseServerClient from '@/lib/supabase/server'

export async function deleteCollection(id: string) {
  const supabase = await createSupabaseServerClient()

  const response = await supabase.from('collections').delete().eq('id', id)

  return response
}

export async function updateCollection({ id, name }: { id: string, name: string }) {
  const supabase = await createSupabaseServerClient()

  console.log(name, id)
  return await supabase.from('collections').update({ name }).eq('id', id)
}