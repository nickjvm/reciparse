'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import request from '@/lib/api'
import RecipeCard from '@/components/atoms/RecipeCard'
import { Recipe, SupaRecipe } from '@/types'
import AppLayout from '@/components/layouts/AppLayout'
import classNames from 'classnames'
import { useRouter, useSearchParams } from 'next/navigation'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function MyRecipes() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<SupaRecipe[]>([])
  const [value, setValue] = useState<string>(searchParams.get('q') || '')
  const router = useRouter()

  useEffect(() => {
    request('/api/recipes/mine').then(({ data }: { data: null|Recipe[], error: null|Error}) => {
      setResults(data?.map(r => ({...r, image_url: r.image } as SupaRecipe)) || [])
    })
  }, [])

  const count = results?.length ?? 0

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <AppLayout withSearch isPrivate className="py-4">
      <h1 className="font-display text-center text-3xl font-bold text-brand-alt mb-3">My Custom Recipes</h1>

      <div className="w-full py-4">
        <div className="flex flex-col-reverse justify-center md:flex-row md:items-center gap-4 ">
          <input
            autoFocus
            className="text-base md:text-base focus:ring-brand-alt block transition w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
            placeholder="Search your recipes"
            type="text"
            value={value}
            onChange={onChange}
          />
          <div className="whitespace-nowrap font-semibold md:w-1/2 md:max-w-[150px] text-center text-sm md:text-base">
            {count} recipe{count !== 1 && 's'}
          </div>
          <div>
            <button onClick={() => router.push('/recipes/create')} className="transition whitespace-nowrap items-center gap-2 flex w-full justify-center rounded-md bg-brand-alt px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-alt">
              <PlusIcon className="w-5" />Add a recipe
            </button>
          </div>
        </div>
      </div>

      <div className={classNames('-mx-2 grid grid-cols-2 gap-3 gap-y-6 md:gap-0 md:gap-y-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-start mb-8')}>
        {results.map(r => <RecipeCard key={r.id} recipe={r} internal  className="md:px-2 w-full sm:w-full md:w-full max-w-full" />)}
      </div>
    </AppLayout>
  )
}