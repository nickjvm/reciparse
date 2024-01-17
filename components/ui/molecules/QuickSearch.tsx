'use client'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface Props {
  size?: 'sm'|'md'|'lg'
  inputClassName?: string
  autoFocus?: boolean
  placeholder?: string
  onSubmitSuccess?: () => void
}

export default function QuickSearch({ size = 'md', inputClassName, autoFocus, placeholder, onSubmitSuccess }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [url, setUrl] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const firstUpdate = useRef(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(false)
    setUrl(e.target.value)
  }

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
    } else {
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    }
  }, [pathname, searchParams])

  useEffect(() => {
    if (autoFocus && global.window?.innerWidth > 768 && !('ontouchstart' in global.window)) {
      inputRef.current?.focus()
    }
  }, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (loading) {
      return
    }

    setError(false)
    if (inputRef.current) {
      try {
        const recipeUrl = new URL(url)
        if (decodeURIComponent(searchParams.get('url') || '') !== recipeUrl.toString()) {
          setLoading(true)
          router.push(`/parse?url=${encodeURIComponent(recipeUrl.toString())}`)
        } else {
          if (onSubmitSuccess) {
            onSubmitSuccess()
          }
        }
      } catch (err) {
        setError(true)
        inputRef.current.focus()
        setLoading(false)
      }
    }
  }

  return (
    <div className="w-full">
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
            required
            value={url}
            onChange={onChange}
            onFocus={e => e.target.select()}
            className={cn(
              error && 'ring-red-600',
              !error && 'ring-slate-300',
              'block transition w-full focus:outline-0 focus:ring-blue-400 ring rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm text-base placeholder:text-slate-500',
              inputClassName, {
                'py-3 sm:leading-8 sm:text-lg pr-12': size === 'lg',
                'pr-9': size === 'md',
                'pr-8': size === 'sm'
              })}
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <button type="submit" disabled={loading} className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-1 py-2 text-sm font-semibold">
              {loading && (
                <AiOutlineLoading3Quarters className={cn('animate-spin w-5 h-5')} />
              )}
              {!loading && (
                <ArrowRightIcon className={cn({
                  'text-red-600': error,
                  'text-primary': !error,
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
