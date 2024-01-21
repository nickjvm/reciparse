'use client'

import { useState, useTransition } from 'react'
import SearchForm from './SearchForm'
import { Collection, DBRecipe, Recipe } from '@/lib/types'
import Card from '@/components/ui/atoms/Card'
import { getRecipes } from '../actions'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { useDidUpdateEffect } from '@/lib/hooks/useDidUpdateEffect'

type Props = {
  recipes: DBRecipe[]
  collections?: Collection[]|null
  count: number
}
export default function View({ recipes: initialRecipes, collections, count: initialCount }: Props) {
  const [count, setCount] = useState<number>(initialCount)
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [isLoading, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const itemsPerPage = 20
  const page = Number(searchParams.get('page') || 1)
  const maxPageCount = Math.ceil(count / itemsPerPage)

  useDidUpdateEffect(() => {
    startTransition(async () => {
      console.log('transition starting...')
      const params = new URLSearchParams(searchParams.toString())
      const { data: recipes, count } = await getRecipes({
        q: params.get('q'),
        collection_id: params.get('collection'),
        page: params.get('page') || '1',
        perPage: itemsPerPage,
      })

      setCount(count as number)
      setRecipes(recipes as unknown as Recipe[])
    })
  }, [searchParams])

  const goToPage = (direction: 'next'|'prev') => {
    let nextPage
    switch (direction) {
      case 'next': {
        nextPage = Math.min(maxPageCount, page + 1)
        break
      }
      case 'prev': {
        nextPage = Math.max(0, page - 1)
      }
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set('page', `${nextPage}`)

    router.push(`${pathname}?${params.toString()}`)
  }


  const handleChange = (args: { q: string, collection_id: string }) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', args.q)
    params.set('collection', args.collection_id)
    params.set('page', '1')

    router.push(`${pathname}?${params}`)
  }

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
      {maxPageCount > 1 && (
        <div className="flex items-center col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 gap-4 justify-center my-8">
          <button className="disabled:opacity-25 disabled:text-black text-primary" disabled={searchParams.get('q') === '1'} onClick={() => goToPage('prev')}>
            <ChevronLeftIcon className="w-5" />
          </button>
          <div className="text-xs text-gray-500">{page} of {maxPageCount}</div>
          <button className="disabled:opacity-25 disabled:text-black text-primary" disabled={page * itemsPerPage >= count} onClick={() => goToPage('next')}>
            <ChevronRightIcon className="w-5"/>
          </button>
        </div>
      )}
    </div>
  )
}