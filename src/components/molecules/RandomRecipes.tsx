'use client'

import { ReactNode, useEffect, useState } from 'react'
import { SupaRecipe } from '@/types'
import request from '@/lib/api'

import { useAuthContext } from '@/context/AuthContext'

import RecipeCard from '../atoms/RecipeCard'
import classNames from 'classnames'

interface Props {
  count?: number
  source?: 'favorites'|'random'
  title: string
  className?: string
  children?: ReactNode
}

export default function RandomRecipes({ count = 8, source = 'random', title, className, children}: Props) {

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
        <div className="w-full mx-auto max-w-screen-2xl p-4 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 justify-center flex-wrap align-stretch">
          {recipes.map((recipe: SupaRecipe|number, i) => (
            <RecipeCard loading={loading}
              key={i}
              recipe={typeof recipe === 'number' ? undefined : recipe}
            />
          ))}
        </div>
        {children}
      </div>
    )
  } else {
    return null
  }
}
