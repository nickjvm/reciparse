'use server'

import createSupabaseServerClient from '@/lib/supabase/server'
import { DBRecipe, Ingredient, Recipe } from '@/lib/types'

type CopyRecipe = {
  id: string;
  collectionName?: string
  recipe: Recipe;
  source?: string|null;
}

export async function copyRecipe({ id: collection_id, collectionName, recipe: _recipe, source}: CopyRecipe) {
  const recipe: DBRecipe = _recipe
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
  recipe.ingredients = recipe.ingredients.map((ingredient: string|Ingredient) => {
    if (typeof ingredient === 'string') {
      return ingredient
    }

    if (ingredient.subtext) {
      return `${ingredient.primary} (${ingredient.subtext})`
    } else {
      return ingredient.primary
    }
  })
  const { data, error } = await supabase.from('recipes').insert({
    name: recipe.name,
    instructions: recipe.instructions,
    ingredients: recipe.ingredients,
    cookTime: recipe.cookTime,
    prepTime: recipe.prepTime,
    totalTime: recipe.totalTime,
    image: recipe.image,
    collection_id: recipe.collection_id,
    yield: recipe.yield,
    source: recipe.source
  } as DBRecipe).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}