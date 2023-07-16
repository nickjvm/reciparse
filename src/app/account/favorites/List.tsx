'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'
import classNames from 'classnames'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { ReciparseRequestError, SupaRecipe } from '@/types'
import clientRequest from '@/lib/api/client'
import { useDebounce } from '@/hooks/useDebounce'
import { useDidUpdateEffect } from '@/hooks/useDidUpdateEffect'

import RecipeCard from '@/components/RecipeCard'
import RecipeError from '@/components/RecipeError'

interface Props {
  count: number
  error: boolean
}

interface FavoritesResponse {
   data: SupaRecipe[],
   count: number,
   error?: ReciparseRequestError
   message?: string
}

export default function FavoritesList({ count: initialCount, error: countError }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [value, setValue] = useState<string>(searchParams.get('q') || '')
  const debouncedValue = useDebounce<string>(value, 500)

  const [loading, setLoading] = useState(true)
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
    if (!initialCount && !countError) {
      return
    }

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
    clientRequest(`/api/recipes/favorites?page=${page}&q=${debouncedValue}&perPage=${itemsPerPage}`).then((response: FavoritesResponse) => {
      if (page || debouncedValue) {
        router.push(`${pathname}?${params}`)
      }
      if (response.error) {
        setError(response.message || 'Something went wrong.')
        setCount(0)
      } else {
        setResults(response.data)
        setCount(response.count)
      }
      setInitted(true)
      setLoading(false)
    })
    // Triggers when "debouncedValue" changes
  }, [debouncedValue, page])

  const maxPageCount = Math.ceil(count / itemsPerPage)

  if (error) {
    return <RecipeError image="/404.svg" errorText={error} className="mb-6" />
  }

  return (
    <>
      <h1 className="font-display text-center text-3xl font-bold text-brand-alt mb-3">My Favorites</h1>
      <>
        <div className="w-full px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <input
              autoFocus
              className="ring-gray-300 text-base md:text-base focus:ring-brand-alt block transition w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
              placeholder="Search your saved recipes"
              type="text"
              value={value}
              onChange={onChange}
            />
            <div className="whitespace-nowrap font-semibold w-1/2 max-w-[150px] text-center text-sm md:text-base">
              {count} recipe{count !== 1 && 's'}
            </div>
          </div>
        </div>
        <div className={classNames('w-full p-2 md:p-4 grid grid-cols-2 gap-3 md:grid-cols-5 justify-start', maxPageCount ===1 && 'mb-8')}>
          {results.map((recipe: SupaRecipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} className="px-2" />
          ))}
        </div>
        {!!results.length && maxPageCount > 1 && (
          <div className="flex items-center gap-4 justify-center mb-8">
            <button className="disabled:opacity-25 disabled:text-black text-brand-alt" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeftIcon className="w-5" />
            </button>
            <div className="text-xs text-gray-500">{page} of {maxPageCount}</div>
            <button className="disabled:opacity-25 disabled:text-black text-brand-alt" disabled={page * itemsPerPage >= count} onClick={() => setPage(page + 1)}>
              <ChevronRightIcon className="w-5"/>
            </button>
          </div>
        )}
      </>
      {!count && !!debouncedValue && (
        <div className="px-4">
          {!!debouncedValue && <RecipeError errorText="We couldn't find any favorited recipes that matched your search." />}
        </div>
      )}
      {loading && !initted && (
        <div className="w-full p-2 md:p-4 grid grid-cols-2 gap-3 md:grid-cols-5 justify-start">
          {Array.from(new Array(10)).map((n, i: number) => <RecipeCard loading key={i} />)}
        </div>
      )}
    </>
  )
}