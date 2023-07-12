'use client'
import { MouseEvent, useEffect, useState } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid'
import clientRequest from '@/lib/api/client'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Props {
  id: number
  saved: boolean
}
export default function SaveRecipe({ id, saved: _saved }: Props) {
  const { user } = useAuthContext()
  const router = useRouter()
  const [saved, setSaved] = useState<boolean>(_saved)

  useEffect(() => {
    setSaved(_saved)
  }, [_saved])
  const handleClick = async (e: MouseEvent) => {
    e.preventDefault()
    try {
      await clientRequest('/api/recipes/save', { method: 'POST', body: JSON.stringify({ id, save: !saved })})
      setSaved(!saved)

      router.refresh()
    } catch (e) {
      console.log(e)
    }
  }
  if (!user) {
    return null
  }
  return (
    <button className="inline-flex ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded hover:bg-slate-100 focus-visible:bg-slate-100" onClick={handleClick}>
      <span className="sr-only">
        {saved ? 'unsave this' : 'save this'}
      </span>
      {saved
        ? <HeartIconFilled className="w-5 md:w-6 fill-brand-alt" />
        : <HeartIcon className="w-5 md:w-6 stroke-brand" />}
    </button>
  )
}