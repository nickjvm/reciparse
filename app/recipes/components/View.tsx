'use client'

import { useMemo, useState, useTransition } from 'react'
import SearchForm from './SearchForm'
import { Collection, Recipe } from '@/lib/types'
import Card from '@/components/ui/atoms/Card'
import { getRecipes } from '../actions'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  recipes: Recipe[]
  collections?: Collection[]|null
}
export default function View({ recipes: initialRecipes, collections, }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [isLoading, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = useMemo(() => (args: { q: string, collection_id: string }) => {
    startTransition(async () => {
      console.log('transition starting...')
      const searchParams = new URLSearchParams()

      if (args.q) {
        searchParams.set('q', args.q)
      }
      if (args.collection_id) {
        searchParams.set('collection', args.collection_id)
      }
      router.push(`${pathname}?${searchParams}`)

      const { data: recipes } = await getRecipes(args)
      setRecipes(recipes as unknown as Recipe[])
    })
  }, [setRecipes, router])

  return (
    <div className="max-w-5xl m-auto">
      <h1 className="text-brand font-display text-3xl font-semibold text-center mb-4">My Recipes</h1>
      <div className="mb-4">
        <SearchForm collections={collections} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {recipes?.map(recipe => {
          let subtitle
          const source = recipe.source ? new URL(recipe.source).hostname : undefined
          if (!searchParams.get('collection')) {
            subtitle = recipe.collection?.name ? `Saved to ${recipe.collection.name}` : source
          } else if (source) {
            subtitle = source.replace('www.', '')
          }
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
        {!recipes.length && (
          <h2 className="col-span-2 md:col-span-5 text-center text-lg font-slate-800 py-4">No recipes matched your search.</h2>
        )}
      </div>
    </div>
  )
}