'use client'

import { useDebounce } from '@/lib/hooks/useDebounce'
import { Collection } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  onChange: (args: { q: string; collection_id: string }) => void;
  collections: Collection[]
}

export default function SearchForm({ onChange, collections }: Props) {
  const searchParams = useSearchParams()

  const [query, setQuery] = useState<string>(searchParams.get('q') || '')
  const debouncedQuery = useDebounce<string>(query, 500)

  const [collection, setCollection] = useState<string>(searchParams.get('collection') || '')

  useEffect(() => {
    onChange({ q: query, collection_id: collection})
  }, [debouncedQuery, collection])

  return (
    <>
      <input type="search" onChange={(e => setQuery(e.target.value))} className="grow py-2 px-4 rounded border border-slate-200 h-10" value={query} />
      {collections && (
        <select onChange={(e) => setCollection(e.target.value)} value={collection} className="min-w-12 rounded py-2 px-2 border border-slate-200 h-10">
          <option value="">All Collections</option>
          {collections.map(collection => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
        </select>
      )}
    </>
  )
}