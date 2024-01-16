import React from 'react'
import readUserSession from '@/lib/actions'
import { readCollections, getRecipes } from './actions'
import { redirect } from 'next/navigation'
import { NextPage } from '@/lib/types'
import View from './components/View'

export default async function Page({ searchParams }: NextPage) {
  const { data } = await readUserSession()

  if (!data?.session) {
    return redirect('/auth-server-action')
  }

  const { data: recipes } = await getRecipes({ q: searchParams.q, collection_id: searchParams.collection })
  const { data: collections } = await readCollections()

  if (recipes) {
    return (
      <View recipes={recipes} collections={collections} />
    )
  }
}
