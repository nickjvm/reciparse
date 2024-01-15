'use server'

import createSupabaseServerClient from '@/lib/supabase/server'
import { Recipe } from '@/lib/types'
import { pick } from '@/lib/utils'

export async function updateRecipe(id: string, values: Recipe) {
  const supabase = await createSupabaseServerClient()

  return await supabase.from('recipes').update(pick(values, ['name', 'collection_id', 'prepTime', 'cookTime', 'totalTime', 'yield', 'source', 'is_public', 'ingredients'])).eq('id', id).select().single()
}