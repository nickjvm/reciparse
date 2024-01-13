'use server'

import createSupabaseServerClient from '@/lib/supabase/server'
import { Recipe } from '@/lib/types'
import { pick } from '@/lib/utils'

type CopyRecipe = {
  id: string;
  collectionName?: string
  recipe: Recipe;
  source?: string;
}

export async function copyRecipe({ id: collection_id, collectionName, recipe, source}: CopyRecipe) {
  const supabase = await createSupabaseServerClient()
  if (collection_id === '-1') {
    if (!collectionName) {
      throw new Error('collectionName is required')
    }

    const { data: collection, error } = await supabase.from('collections').insert({
      name: collectionName,
    }).select().single()

    if (error) {
      throw new Error(error.message)
    }

    recipe.collection_id = collection?.id
  } else {
    recipe.collection_id = collection_id
  }

  recipe.source = source
  recipe.ingredients = recipe.ingredients.map(ingredient => {
    if (typeof ingredient === 'string') {
      return ingredient
    }

    if (ingredient.subtext) {
      return `${ingredient.primary} (${ingredient.subtext})`
    } else {
      return ingredient.primary
    }
  })
  const { data, error } = await supabase.from('recipes').insert(
    pick(recipe, [
      'name',
      'instructions',
      'ingredients',
      'cookTime',
      'prepTime',
      'totalTime',
      'image',
      'collection_id',
      'yield',
      'source',
    ])
  ).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}