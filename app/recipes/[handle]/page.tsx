import React from 'react'

import { NextPage } from '@/lib/types'
import createSupabaseServerClient from '@/lib/supabase/server'
import { getRecipeIngredients } from '@/app/parse/actions'
import readUserSession from '@/lib/actions'

import FullRecipe from '@/components/ui/molecules/FullRecipe'
import ContentContainer from '@/components/ui/templates/ContentContainer'
import RecipeSchema from '@/components/ui/atoms/RecipeSchema'
import { decode } from 'html-entities'
import { Metadata } from 'next'
import { saveToHistory } from '../actions'

async function getRecipe(handle: string) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await readUserSession()

  const { data, error } = await supabase.from('recipes').select().eq('id', handle).single()

  if (error)  {
    return { data, error }
  }

  if (data.created_by === session?.user.id || data.is_public) {
    return { data, error }
  }

  return {
    data: null,
    error: {
      message: 'Recipe not found',
    },
    count: null,
    status: 404,
    statusText: 'NotFound'
  }
}

export const generateMetadata = async ({ params, searchParams }: NextPage): Promise<Metadata> => {
  const { data: recipe } = await getRecipe(params.handle)
  if (recipe) {
    return {
      title: `${decode(recipe.name)} | Reciparse`,
      openGraph: {
        type: 'article',
        siteName: 'Reciparse',
        url: `parse?url=${searchParams.url}`,
        images: recipe.image || 'og-image.png',
        description: `Check out this ${recipe.name} recipe! No videos, ads or stories - it's only the recipe!`
      }
    }
  } else {
    return {
      title: 'Recipe not found | Reciparse',
      openGraph: {
        images: 'og-image.png',
      }
    }
  }
}

export default async function Page({ params }: NextPage) {
  const { data: { session } } = await readUserSession()
  const { data, error } = await getRecipe(params.handle)

  if (error) {
    throw new Error(error.message)
  }

  const recipe = {
    ...data,
    ingredients: await getRecipeIngredients(data.ingredients),
  }

  if (data?.id) {
    await saveToHistory(data.id)
  }

  return (
    <ContentContainer>
      <RecipeSchema recipe={recipe} />
      <FullRecipe recipe={recipe} user={session?.user} />
    </ContentContainer>
  )
}
