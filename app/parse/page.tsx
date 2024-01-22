import React from 'react'
import { parseRecipe } from './actions'
import { NextPage } from '@/lib/types'
import readUserSession from '@/lib/actions'
import FullRecipe from '@/components/ui/molecules/FullRecipe'
import { decode } from 'html-entities'
import ContentContainer from '@/components/ui/templates/ContentContainer'
import RecipeSchema from '@/components/ui/atoms/RecipeSchema'
import { Metadata } from 'next'


export const generateMetadata = async ({ searchParams }: NextPage): Promise<Metadata> => {
  const recipe = await parseRecipe(searchParams.url)
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
}

export default async function Page({ searchParams }: NextPage) {
  const { data } = await readUserSession()
  const recipe = await parseRecipe(searchParams.url)

  return (
    <ContentContainer>
      <RecipeSchema recipe={recipe} />
      <FullRecipe recipe={recipe} user={data?.session?.user} />
    </ContentContainer>
  )
}
