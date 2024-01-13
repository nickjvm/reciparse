import React from 'react'
import CreateForm from './components/CreateForm'
import readUserSession from '@/lib/actions'
import { readCollections, readTodo } from './actions'
import Link from 'next/link'

export default async function Page() {

  const { data } = await readUserSession()

  if (!data?.session) {
    // return redirect('/auth-server-action');
  }

  const { data: recipes } = await readTodo()
  const { data: collections } = await readCollections()

  return (
    <div className="flex justify-center items-center">
      <div className="w-96 space-y-5">
        {data.session && <CreateForm />}
        {recipes?.map(recipe => {
          const collection = recipe.collections
          return <Link className="block" href={`/recipes/${recipe.id}`} key={recipe.id}>{recipe.name} {collection ? `- ${collection?.name}` : null}</Link>
        })}
        {collections?.map(collection => {
          return <div key={collection.name}>{collection.name}</div>
        })}
      </div>
    </div>
  )
}
