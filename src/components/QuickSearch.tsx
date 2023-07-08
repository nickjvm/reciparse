'use client'
import { FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightIcon } from '@heroicons/react/20/solid';

export default function QuickSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()


    if (inputRef.current) {
      inputRef.current.classList.remove('ring-red-300', 'focus:ring-red-600')
      inputRef.current.classList.add('ring-gray-300', 'focus:ring-blue-600')
      try {
        const url = new URL(inputRef.current?.value)
        router.push(`/recipe?url=${url.toString()}`)
        inputRef.current.value = ''
        inputRef.current.blur()
      } catch (err) {
        inputRef.current.classList.remove('ring-gray-300', 'focus:ring-blue-600')
        inputRef.current.classList.add('ring-red-300', 'focus:ring-red-600')
        inputRef.current.focus()
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
            ref={inputRef}
            type="text"
            name="search"
            id="search"
            placeholder="Paste a recipe URL"
            className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <button type="submit" className="text-brand-alt relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-1 py-2 text-sm font-semibold">
              <ArrowRightIcon className="w-5"/>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
