'use client'

import { Input } from '@/components/ui/input'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { Collection } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Props = {
  onChange: (args: { q: string; collection_id: string }) => void;
  collections?: Collection[]|null
}

export default function SearchForm({ onChange, collections }: Props) {
  const searchParams = useSearchParams()

  const [query, setQuery] = useState<string>(searchParams.get('q') || '')
  const debouncedQuery = useDebounce<string>(query, 500)

  const [collection, setCollection] = useState<string>(searchParams.get('collection') || '')

  const prevCollectionRef = useRef<string>(collection)
  useEffect(() => {
    if (debouncedQuery !== query || prevCollectionRef.current !== collection) {
      prevCollectionRef.current = collection
      onChange({ q: query, collection_id: collection})
    }
  }, [debouncedQuery, collection, query])

  return (
    <div className="grid grid-cols-12 gap-3">
      <Input onChange={(e => setQuery(e.target.value))} placeholder="Start typing to search" className="col-span-12 md:col-span-9" value={query} />
      {collections && (
        <select onChange={(e) => setCollection(e.target.value)} value={collection} className="bg-white flex h-9 w-full rounded-md border border-input px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-8 md:col-span-3">
          <option value="">All Collections</option>
          {collections.map(collection => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
        </select>
      )}
    </div>
  )
}