'use client'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'

import gtag from '@/lib/gtag'

import Loading from '@/components/icons/Loading'
import { OnNavigation } from '@/components/utils/OnNavigation'

interface Props {
  size?: 'sm'|'md'|'lg'
  inputClassName?: string
  autoFocus?: boolean
  placeholder?: string
}

export default function QuickSearch({ size = 'md', inputClassName, autoFocus, placeholder }: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [url, setUrl] = useState(pathname === '/recipe' ? searchParams.get('url') || '' : '')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(false)
    setUrl(e.target.value)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (loading) {
      return
    }

    setError(false)
    if (inputRef.current) {
      try {
        const recipeUrl = new URL(url)
        setLoading(true)
        router.refresh()
        router.push(`/recipe?url=${recipeUrl.toString()}`)
        gtag('search_recipe', { url: recipeUrl.toString() })
        inputRef.current.blur()
      } catch (err) {
        setError(true)
        inputRef.current.focus()
        setLoading(false)
      }
    }
  }

  return (
    <div className="w-full">
      <OnNavigation callback={() => setLoading(false)}/>
      <label htmlFor="search" className="sr-only">
        Quick search
      </label>
      <div className="relative flex items-center">
        <form onSubmit={onSubmit} className="w-full">
          <input
            readOnly={loading}
            ref={inputRef}
            type="text"
            name="search"
            id="search"
            placeholder={placeholder || 'Paste a recipe URL'}
            autoFocus={!!autoFocus && (global.window.innerWidth > 768 && !('ontouchstart' in window))}
            required
            value={url}
            onChange={onChange}
            className={classNames(
              error && 'ring-red-300 focus:ring-red-600',
              !error && 'ring-gray-300 focus:ring-brand-alt',
              'block transition w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-inset',
              inputClassName, {
                'py-3 sm:leading-8 sm:text-lg pr-12': size === 'lg',
                'pr-9': size === 'md',
                'pr-8': size === 'sm'
              })}
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <button type="submit" disabled={loading} className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-1 py-2 text-sm font-semibold">
              {loading && (
                <Loading
                  animate
                  className={classNames('text-brand-alt', {
                    'w-4': size === 'sm',
                    'w-5': size === 'md',
                    'w-6': size === 'lg',
                  })}
                />
              )}
              {!loading && (
                <ArrowRightIcon className={classNames({
                  'text-red-500': error,
                  'text-brand-alt': !error,
                  'w-4': size === 'sm',
                  'w-5': size === 'md',
                  'w-8': size === 'lg',
                })}/>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
