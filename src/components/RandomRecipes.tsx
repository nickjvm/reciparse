'use client'

import { useEffect, useState } from 'react'
import { SupaRecipe } from '@/types'
import clientRequest from '@/lib/api/client'

import RecipeCard from './RecipeCard'

interface Props {
  count?: number
}
export default function RandomRecipes({ count = 8}: Props) {

  const [recipes, setRecipes] = useState<SupaRecipe[]|number[]>(Array.from(new Array(count)))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      setRecipes(await clientRequest('/api/recipes/random'))
      setLoading(false)
    }
    getData()
  }, [])

  if (recipes && recipes.length) {
    return (
      <div className="w-full mt-6">
        <h2 className="font-display text-center text-2xl font-bold text-brand-alt">Discover Recipes</h2>
        <div className="w-full mx-auto max-w-screen-2xl p-4 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 xl:gap-5 justify-center flex-wrap align-stretch mb-4">
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