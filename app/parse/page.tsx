import React from 'react'
import { parseRecipe } from './actions'
import { NextPage } from '@/lib/types'
import readUserSession from '@/lib/actions'
import FullRecipe from '@/components/ui/molecules/FullRecipe'
import { decode } from 'html-entities'
import ContentContainer from '@/components/ui/templates/ContentContainer'
import RecipeSchema from '@/components/ui/atoms/RecipeSchema'

export const generateMetadata = async ({ searchParams }: NextPage) => {
  const recipe = await parseRecipe(searchParams.url)
  return {
    title: `${decode(recipe.name)} | Reciparse`,
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
