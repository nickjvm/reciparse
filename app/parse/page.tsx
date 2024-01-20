import React from 'react'
import { parseRecipe } from './actions'
import {  NextPage } from '@/lib/types'
import readUserSession from '@/lib/actions'
import FullRecipe from '@/components/ui/molecules/FullRecipe'
import AppLayout from '@/components/ui/templates/AppLayout'
import { decode } from 'html-entities'

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
    <AppLayout session={data?.session}>
      <FullRecipe recipe={recipe} user={data?.session?.user} />
    </AppLayout>
  )
}
