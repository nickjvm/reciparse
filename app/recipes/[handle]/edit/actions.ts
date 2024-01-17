'use server'

import pick from 'lodash.pick'
import readUserSession from '@/lib/actions'
import createSupabaseServerClient from '@/lib/supabase/server'
import { DBRecipe } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function updateRecipe(id: string, values: DBRecipe) {
  const supabase = await createSupabaseServerClient()
  const response = await supabase.from('recipes').update(pick(values, ['name', 'collection_id', 'prepTime', 'cookTime', 'totalTime', 'yield', 'source', 'is_public', 'ingredients', 'instructions'])).eq('id', id).select().single()

  if (!response.error) {
    revalidatePath(`/recipes/${response.data.id}`)
  }

  return response
}

export async function deleteRecipe(id: string) {
  const supabase = await createSupabaseServerClient()
  const { data } = await readUserSession()

  if (!data.session) {
    return {
      data: null,
      error: {
        message: 'Unauthorized',
      },
      count: null,
      status: 500,
      statusText: 'Unauthorized'
    }
  }

  const response = await supabase.from('recipes').delete().eq('id', id).eq('created_by', data.session.user.id)

  if (!response.error) {
    revalidatePath('/recipes')
    revalidatePath('/collections')
  }

  return response
}