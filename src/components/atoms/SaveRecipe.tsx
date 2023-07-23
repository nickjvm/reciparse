'use client'
import { MouseEvent, useEffect, useState } from 'react'
import classNames from 'classnames'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid'

import request from '@/lib/api'
import gtag from '@/lib/gtag'
import debug from '@/lib/debug'

import { useAuthContext } from '@/context/AuthContext'
import { useNotificationContext } from '@/context/NotificationContext'
import { SavedRecipe } from '@/types'

interface Props {
  id: number
  saved: boolean
  onChange?: (value: null|SavedRecipe) => void
}
export default function SaveRecipe({ id, saved: _saved, onChange }: Props) {
  const { user, setAuthType } = useAuthContext()
  const [saved, setSaved] = useState<boolean>(_saved)
  const { showNotification } = useNotificationContext()

  useEffect(() => {
    setSaved(_saved)
  }, [_saved])

  useEffect(() => {
    if (!user) {
      setSaved(false)
    } else {
      setSaved(_saved)
    }
  }, [user])

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault()
    if (!user) {
      setAuthType('signup')
      return
    }

    try {
      const { data, error }: { data: null|SavedRecipe, error: null|Error} = await request('/api/recipes/save', {
        method: 'POST',
        body: JSON.stringify({ id, save: !saved })
      })
      if (error) {
        showNotification({
          title: 'Oops',
          message: 'Something went wrong. Please try again',
          variant: 'error'
        })
      } else {
        if (!saved) {
          gtag('save_recipe', { id })
        }
        setSaved(!saved)
        onChange?.(data)
      }
    } catch (e) {
      debug(e)
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
