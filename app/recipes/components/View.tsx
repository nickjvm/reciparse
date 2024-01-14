'use client'

import { useState, useTransition } from 'react'
import SearchForm from './SearchForm'
import { Collection, Recipe } from '@/lib/types'
import Card from '@/components/ui/atoms/Card'
import { getRecipes } from '../actions'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  recipes: Recipe[]
  collections: Collection[]
}
export default function View({ recipes: initialRecipes, collections, }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [isLoading, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (args: { q: string, collection_id: string }) => {
    startTransition(async () => {
      const searchParams = new URLSearchParams()

      if (args.q) {
        searchParams.set('q', args.q)
      }
      if (args.collection_id) {
        searchParams.set('collection', args.collection_id)
      }
      router.push(`${pathname}?${searchParams}`)

      const { data: recipes } = await getRecipes(args)
      setRecipes(recipes)
    })
  }

  return (
    <div className="max-w-5xl m-auto">
      <h1 className="text-brand font-display text-3xl font-semibold text-center mb-2">My Recipes</h1>
      <div className="flex gap-2 mb-4">
        <SearchForm collections={collections} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-5 gap-3">
        {recipes?.map(recipe => {
          const subtitle = recipe.source ? new URL(recipe.source).hostname : undefined
          return (
            <Card
              loading={isLoading}
              key={recipe.id}
              image={recipe.image}
              url={`/recipes/${recipe.id}`}
              title={recipe.name}
              subtitle={subtitle}
            />
          )
        })}
      </div>
    </div>
  )
}