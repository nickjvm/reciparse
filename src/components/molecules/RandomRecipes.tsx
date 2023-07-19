'use client'

import { useEffect, useState } from 'react'
import { SupaRecipe } from '@/types'
import request from '@/lib/api'

import { useAuthContext } from '@/context/AuthContext'

import RecipeCard from '../atoms/RecipeCard'

interface Props {
  count?: number
}
export default function RandomRecipes({ count = 8}: Props) {

  const [recipes, setRecipes] = useState<SupaRecipe[]|number[]>(Array.from(new Array(count)))
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')

  const { user, userLoading } = useAuthContext()

  useEffect(() => {
    if (!userLoading) {
      getRandomRecipes(user?.id)
    }
  }, [user, userLoading])

  const getRandomRecipes = async (user_id?: string) => {
    let data: null|SupaRecipe[] = null
    if (user_id) {
      ({ data } = await request('/api/recipes/favorites/random'))
      if (data?.length) {
        setTitle('Explore Your Favorites')
      }
    }

    if (!data?.length) {
      setTitle('Discover Recipes');
      ({ data } = await request('/api/recipes/random'))
    }

    setRecipes(data || [])
    setLoading(false)
  }

  if (recipes && recipes.length) {
    return (
      <div className="w-full mt-6 md:mt-9 md:mb-9">
        <h2 className="font-display text-center text-2xl md:text-4xl font-bold text-brand-alt">{title}</h2>
        <div className="w-full mx-auto max-w-screen-2xl p-4 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 justify-center flex-wrap align-stretch mb-4">
          {recipes.map((recipe: SupaRecipe|number, i) => (
            <RecipeCard loading={loading}
              key={i}
              recipe={typeof recipe === 'number' ? undefined : recipe}
            />
          ))}
        </div>
      </div>
    )
  } else {
    return null
  }
}
