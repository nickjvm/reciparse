'use client'
import { useRef, useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'

import clientRequest from '@/lib/api/client'

import { useDebounce } from '@/hooks/useDebounce'
import { useDidUpdateEffect } from '@/hooks/useDidUpdateEffect'
import Loading from './icons/Loading'
import classNames from 'classnames'

interface Props {
  id: number
  value?: string|null
}
export default function RecipeNotes({ id, value: _value }: Props) {
  const [value, setValue] = useState<string>(_value || '')
  const debouncedValue = useDebounce<string>(value, 1000)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const saveNotes = async () => {
    setLoading(true)
    setError(false)
    try {
      const { error } = await clientRequest('/api/recipes/notes', { method: 'POST', body: JSON.stringify({ id, notes: debouncedValue })})
      if (error) {
        throw new Error(error.message)
      }
    } catch (e) {
      console.log(e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  useDidUpdateEffect(() => {
    saveNotes()
  }, [debouncedValue])

  const onInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = ''
      inputRef.current.style.height = inputRef.current?.scrollHeight + 'px'
    }
  }
  return (
    <div className={classNames('z-0 relative pb-4 group print:break-inside-avoid', !value && 'print:hidden')}>
      <h2 className="text-xl font-bold mb-2 mt-4">Notes</h2>
      <p className="text-sm"></p>
      <textarea
        ref={inputRef}
        maxLength={500}
        value={value}
        placeholder="Enter any personal preparation notes here..."
        onChange={(e) => {
          setValue(e.target.value)
          setLoading(true)
        }}
        onInput={onInput}
        className="w-full text-sm border-0 resize-none rounded outline outline-1 outline-solid outline-slate-400 focus:outline-offset-0 focus:outline-brand transition print:outline-0 print:p-0 print:text-base"
      />
      <div className="absolute bottom-0 right-0 flex justify-end items-center gap-3">
        <div className="group-focus-within:inline-block hidden text-xs text-gray-500">{value.trim().length}/500</div>
        {loading && <Loading animate className="w-4" />}
        {!loading && error && <XCircleIcon className="hidden group-focus-within:inline-block w-4 text-red-600" />}
        {!loading && !error && value && <CheckCircleIcon className="hidden group-focus-within:inline-block w-4 text-green-600" />}
      </div>
    </div>
  )
}