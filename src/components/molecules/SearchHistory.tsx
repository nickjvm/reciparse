'use client'

import { SupaRecipe } from '@/types'
import RecipeCard from '../atoms/RecipeCard'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import request from '@/lib/api'

interface Props {
  className?: string
}
export default function SearchHistory({ className }: Props) {
  const [recipes, setRecipes] = useState<SupaRecipe[]>([])
  const { user, userLoading } = useAuthContext()

  useEffect(() => {
    const getHistory = async () => {
      if (userLoading) {
        return
      }
      const localHistory = JSON.parse(localStorage.getItem('search_history') || '[]')
      if (user) {
        // fetch
        const { data } = await request('/api/recipes/history')
        if (data.recipes) {
          const mergedHistory = [...localHistory, ...data.recipes]
          const uniqueHistory = [...new Map(mergedHistory.map(item =>[item.id, item])).values()]
          uniqueHistory.length = Math.min(uniqueHistory.length, 8)
          setRecipes(uniqueHistory)
        }
      } else {
        setRecipes(localHistory)
      }
    }

    getHistory()
  }, [userLoading, user?.id])

  if (!recipes.length) {
    return null
  }

  return (
    <div className={classNames('w-full', className)}>
      <h2 className="font-display text-center text-2xl md:text-4xl font-bold text-brand-alt">Recently Viewed</h2>
      <div className="w-full overflow-x-auto mx-auto max-w-screen-2xl p-4 flex gap-4 align-stretch no-scrollbar xl:justify-center">
        {recipes.map((recipe: SupaRecipe) => {
          return <RecipeCard recipe={recipe} key={recipe.id} />
        })
        }
      </div>
    </div>
  )
}