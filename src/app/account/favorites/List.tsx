'use client'

import RecipeCard from '@/components/RecipeCard'
import RecipeError from '@/components/RecipeError'
import { useDebounce } from '@/hooks/useDebounce'
import clientRequest from '@/lib/api/client'
import { SupaRecipe } from '@/types'
import { ChangeEvent, useEffect, useState } from 'react'

interface Props {
  data: SupaRecipe[]
}

export default function FavoritesList({ data }: Props) {
  const [value, setValue] = useState<string>('')
  const debouncedValue = useDebounce<string>(value, 500)
  const [results, setResults] = useState<SupaRecipe[]>(data)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    if (debouncedValue) {
      clientRequest('/api/recipes/search?q=' + debouncedValue).then((response: SupaRecipe[]) => {
        setResults(response)
      })
    } else {
      setResults(data)
    }
    // Triggers when "debouncedValue" changes
  }, [debouncedValue])

  return (
    <>
      {!!data.length && (
        <div className="w-full px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <input
              className="ring-gray-300 text-xs md:text-base focus:ring-brand-alt block transition w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
              placeholder="Search your saved recipes"
              type="text"
              onChange={onChange}
            />
            <div className="whitespace-nowrap font-semibold w-1/2 max-w-[150px] text-center text-sm md:text-base">
              {results.length} recipe{results.length !== 1 && 's'}
            </div>
          </div>
        </div>
      )}
      {!!results.length && (
        <div className="w-full p-2 md:p-4 grid grid-cols-2 gap-3 md:grid-cols-5 justify-start">
          {results.map((recipe: SupaRecipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} className="px-2" />
          ))}
        </div>
      )}
      {!results.length && (
        <div className="px-4">
          {!!debouncedValue && <RecipeError errorText="We couldn't find any favorited recipes that matched your search." />}
          {!debouncedValue && <RecipeError errorTitle="Start saving!" image="/favorite.svg" errorText="Looks like you haven't saved any recipes yet." />}
        </div>
      )}
    </>
  )
}