'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'
import classNames from 'classnames'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { SupaRecipe } from '@/types'
import request from '@/lib/api'

import { useDebounce } from '@/hooks/useDebounce'
import { useDidUpdateEffect } from '@/hooks/useDidUpdateEffect'

import RecipeCard from '@/components/atoms/RecipeCard'
import RecipeError from '@/components/molecules/RecipeError'

interface Props {
  count: number
  error: boolean
  loading: boolean
}
interface FavoritesResponse {
  data: null|{
    recipes: SupaRecipe[],
    count: number,
  }
  error: null|Error
}

export default function FavoritesList({ count: initialCount, error: countError, loading: countLoading }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [value, setValue] = useState<string>(searchParams.get('q') || '')
  const debouncedValue = useDebounce<string>(value, 500)

  const [loading, setLoading] = useState(countLoading)
  const [error, setError] = useState<null|string>(null)
  const [initted, setInitted] = useState(false)
  const [results, setResults] = useState<SupaRecipe[]>([])
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 1)
  const [count, setCount] = useState<number>(initialCount)

  const itemsPerPage = Math.min(parseInt(searchParams.get('perPage') || '25', 10), 100)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  useDidUpdateEffect(() => {
    setPage(1)
  }, [debouncedValue])

  useEffect(() => {
    if (!loading && !initialCount && !countError) {
      return
    }

    getFavorites()
  }, [debouncedValue, page])

  const getFavorites = async () => {
    const params = new URLSearchParams(searchParams.toString())

    if (page && page > 1) {
      params.set('page', `${page}`)
    } else {
      params.delete('page')
    }
    if (debouncedValue) {
      params.set('q', debouncedValue)
    } else {
      params.delete('q')
    }

    setLoading(true)
    setError(null)
    const { data, error }: FavoritesResponse = await request(`/api/recipes/favorites?page=${page}&q=${debouncedValue}&perPage=${itemsPerPage}`)

    if (page || debouncedValue) {
      router.push(`${pathname}?${params}`)
    }
    if (error) {
      setError(error.message)
      setCount(0)
    } else if (data) {
      setResults(data.recipes)
      setCount(data.count)
    }
    setInitted(true)
    setLoading(false)
  }
  const maxPageCount = Math.ceil(count / itemsPerPage)

  if (error) {
    return <RecipeError image="/404.svg" errorText={error} className="mb-6" />
  }

  return (
    <>
      <h1 className="font-display text-center text-3xl font-bold text-brand-alt mb-3">My Favorites</h1>
      <div className="w-full py-4">
        <div className="flex flex-col-reverse justify-center md:flex-row md:items-center gap-4 ">
          <input
            autoFocus
            className="ring-gray-300 text-base md:text-base focus:ring-brand-alt block transition w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
            placeholder="Search your saved recipes"
            type="text"
            value={value}
            onChange={onChange}
          />
          <div className="whitespace-nowrap font-semibold md:w-1/2 md:max-w-[150px] text-center text-sm md:text-base">
            {initted && (
              <>{count} recipe{count !== 1 && 's'}</>
            )}
          </div>
        </div>
      </div>
      <div className={classNames('-mx-2 grid grid-cols-2 gap-3 gap-y-6 md:gap-0 md:gap-y-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-start', maxPageCount === 1 && 'mb-8')}>
        {!loading && !!results.length && (
          results.map((recipe: SupaRecipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} className="md:px-2 w-full sm:w-full md:w-full max-w-full" />
          ))
        )}
        {loading && (
          Array.from(new Array(results.length || 10)).map((n, i: number) => <RecipeCard loading key={i} className="md:px-2 w-full sm:w-full md:w-full max-w-full" />)
        )}
        {maxPageCount > 1 && (
          <div className="flex items-center col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 gap-4 justify-center my-8">
            <button className="disabled:opacity-25 disabled:text-black text-brand-alt" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeftIcon className="w-5" />
            </button>
            <div className="text-xs text-gray-500">{page} of {maxPageCount}</div>
            <button className="disabled:opacity-25 disabled:text-black text-brand-alt" disabled={page * itemsPerPage >= count} onClick={() => setPage(page + 1)}>
              <ChevronRightIcon className="w-5"/>
            </button>
          </div>
        )}
      </div>
      {initted && !count && !!debouncedValue && (
        <RecipeError errorText="We couldn't find any favorited recipes that matched your search." />
      )}
    </>
  )
}