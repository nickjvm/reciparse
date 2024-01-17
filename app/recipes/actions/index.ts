'use server'

import createSupabaseServerClient from '@/lib/supabase/server'
import { Collection, DBRecipe } from '@/lib/types'
import pick from 'lodash.pick'
import { unstable_noStore } from 'next/cache'

// export async function createTodo(title: string) {
//   const supabase = await createSupabaseServerClient()

//   const result = await supabase.from('recipes').insert({ title }).single()
//   revalidatePath('/recipes')
//   return JSON.stringify(result)
// }

type SearchParams = {
  q?: string
  page?: string
  collection_id?: string
}

export async function getRecipes({ q, page, collection_id }: SearchParams) {
  unstable_noStore()
  const supabase = await createSupabaseServerClient()

  const query = supabase.from('recipes').select('*, collection:collections(id, name)', { count: 'exact' })

  if (q) {
    query.ilike('name', `%${q}%`)
    // query.ilike('collection.name', `%${q}%`)
    // query.or(`name.ilike.%${q}%, collections.name.ilike.%${q}%`, { foreignTable: 'collections' })
  }

  if (collection_id) {
    query.eq('collection_id', collection_id)
  }

  if (page) {
    const pageIndex = Number(page) - 1
    const perPage = 25
    query.range(pageIndex * perPage, (pageIndex * perPage) + (perPage - 1))
  }

  query.order('created_at', { ascending: false })

  const result = await query

  return result
}

export async function readCollections() {
  unstable_noStore()
  const supabase = await createSupabaseServerClient()

  const result = await supabase.from('collections').select('name, id, recipes(name)')

  return result as { data: Collection[] }
}

export async function createRecipe(values: DBRecipe) {
  if (typeof values.ingredients === 'string') {
    values.ingredients = values.ingredients.split('\n').map((v: string) => v.trim())
  }
  const supabase = await createSupabaseServerClient()
  const response = await supabase.from('recipes').insert(pick(values, ['name', 'collection_id', 'prepTime', 'cookTime', 'totalTime', 'yield', 'source', 'is_public', 'ingredients', 'instructions'])).select().single()

  return response
}
