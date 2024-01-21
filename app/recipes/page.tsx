import React from 'react'
import readUserSession from '@/lib/actions'
import { readCollections, getRecipes } from './actions'
import { redirect } from 'next/navigation'
import { NextPage } from '@/lib/types'
import View from './components/View'
import ContentContainer from '@/components/ui/templates/ContentContainer'

export default async function Page({ searchParams }: NextPage) {
  const { data } = await readUserSession()

  if (!data?.session) {
    return redirect('/auth-server-action')
  }

  const { data: recipes, count } = await getRecipes({ q: searchParams.q, collection_id: searchParams.collection, page: searchParams.page, perPage: 20 })
  const { data: collections } = await readCollections()


  return (
    <ContentContainer>
      <View recipes={recipes || []} collections={collections} count={count || 0}/>
    </ContentContainer>
  )
}
