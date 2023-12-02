'use client'
import { MouseEvent, useEffect, useState } from 'react'
import classNames from 'classnames'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid'

import request from '@/lib/api'
import gtag from '@/lib/gtag'
import debug from '@/lib/debug'

import { useAuthContext } from '@/context/AuthContext'
import { SavedRecipe } from '@/types'
import { useRouter } from 'next/navigation'

interface Props {
  id: number
  saved: boolean
  onChange?: (value: null|SavedRecipe) => void
}
export default function SaveRecipe({ id }: Props) {
  const { user, setAuthType } = useAuthContext()
  const [saved, setSaved] = useState<SavedRecipe|null>(null)
  const router = useRouter()

  const getSaved = async () => {
    if (user) {
      try {
        const { data }: { data: null|SavedRecipe} = await request(`/api/recipes/saved/${id}`)
        setSaved(data)
      } catch (e) {
        debug(e)
      }
    }
  }

  useEffect(() => {
    if (!user) {
      setSaved(null)
    } else {
      getSaved()
    }
  }, [user, id])

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault()
    if (!user) {
      setAuthType('signup')
      return
    }

    if (saved) {
      return router.push(`/recipes/view/${saved.handle}`)
    }

    try {
      const { data } = await request('/api/recipes/copy/' + id , {
        method: 'POST',
      })

      gtag('save_recipe', { id })

      router.push(`/recipes/view/${data.handle}`)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <button className={classNames('inline-flex ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded hover:bg-slate-100 focus-visible:bg-slate-100', !saved && 'print:hidden')} onClick={handleClick}>
      <span className="sr-only">
        {saved ? 'unsave this' : 'save this'}
      </span>
      {saved
        ? <HeartIconFilled className="w-5 md:w-6 fill-brand-alt" />
        : <HeartIcon className="w-5 md:w-6 stroke-brand" />}
    </button>
  )
}
