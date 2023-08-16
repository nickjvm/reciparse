'use client'

import { useEffect, useState } from 'react'
import request from '@/lib/api'
import RecipeCard from '@/components/atoms/RecipeCard'
import { SupaRecipe } from '@/types'
import AppLayout from '@/components/layouts/AppLayout'

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<SupaRecipe[]>([])
  useEffect(() => {
    request('/api/recipes/mine').then(({ data }: { data: null|SupaRecipe[], error: null|Error}) => {
      setRecipes(data?.map(r => ({...r, image_url: r.image })) || [])
    })
  }, [])

  return (
    <AppLayout withSearch>
      {recipes.map(r => <RecipeCard key={r.id} recipe={r} internal />)}
    </AppLayout>
  )
}