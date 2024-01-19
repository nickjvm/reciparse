import React from 'react'
import { parseRecipe } from './actions'
import {  NextPage } from '@/lib/types'
import readUserSession from '@/lib/actions'
import FullRecipe from '@/components/ui/molecules/FullRecipe'

export default async function Page({ searchParams }: NextPage) {
  const { data: sessionData } = await readUserSession()
  const recipe = await parseRecipe(searchParams.url)

  return <FullRecipe recipe={recipe} user={sessionData?.session?.user} />
}
