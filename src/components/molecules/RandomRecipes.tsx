'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

import { SupaRecipe } from '@/types'
import request from '@/lib/api'

import { useAuthContext } from '@/context/AuthContext'

import RecipeCard from '../atoms/RecipeCard'

interface Props {
  count?: number
  source?: 'favorites'|'random'
  title: string
  className?: string
  children?: ReactNode
}

export default function RandomRecipes({ count = 8, source = 'random', title, className}: Props) {

  const [recipes, setRecipes] = useState<SupaRecipe[]|number[]>(Array.from(new Array(count)))
  const [loading, setLoading] = useState(true)

  const { user, userLoading } = useAuthContext()

  useEffect(() => {
    if (userLoading) {
      return
    }

    const getRecipes = async () => {
      let endpoint = '/api/recipes/random'
      if (source === 'favorites') {
        endpoint = '/api/recipes/favorites/random'
        if (!user) {
          return
        }
      }

      const { data }: { data: null|SupaRecipe[] } = await request(endpoint)

      setRecipes(data || [])
      setLoading(false)
    }

    getRecipes()
  }, [user, userLoading])


  if (source === 'favorites' && (!user || loading)) {
    return null
  }

  if (recipes && recipes.length) {
    return (
      <div className={classNames('w-full', className)}>
        <h2 className="font-display text-center text-2xl md:text-4xl font-bold text-brand-alt">{title}</h2>
        <div className="w-full overflow-x-auto mx-auto max-w-screen-2xl p-4 flex gap-4 align-stretch no-scrollbar xl:justify-center">
          {recipes.map((recipe: SupaRecipe|number, i) => (
            <RecipeCard loading={loading}
              key={i}
              recipe={typeof recipe === 'number' ? undefined : recipe}
            />
          ))}
        </div>
        {source === 'favorites' && recipes.length >= 8 && (
          <div className="text-center px-4 pt-6 md:pt-0">
            <Link className="justify-center px-4 py-4 md:py-2 text-white bg-brand-alt font-semibold rounded flex md:inline-flex gap-3 md:hover:bg-brand focus-visible:bg-brand transition" href="/account/favorites">All Favorites <ArrowRightIcon className="w-5" /></Link>
          </div>
        )}
      </div>
    )
  } else {
    return null
  }
}
