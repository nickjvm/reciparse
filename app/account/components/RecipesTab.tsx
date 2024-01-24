'use client;'
import { getRecipes } from '@/app/recipes/actions'
import { Button } from '@/components/ui/button'
import { DBRecipe } from '@/lib/types'
import { PencilIcon } from '@heroicons/react/24/solid'
import { CaretLeftIcon, CaretRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useState } from 'react'

type Props = {
  recipes: { recipes: DBRecipe[]|null, count: number|null }
}

export default function RecipesTab({ recipes: _recipes }: Props) {
  const [page, setPage] = useState(1)
  const [recipes, setRecipes] = useState(_recipes.recipes)
  const perPage = 15
  const totalPageCount = Math.ceil((_recipes.count || perPage) / perPage)

  const goToPage = (dir: 'next'|'prev') => async () => {
    const nextPage = dir === 'next' ? Math.min(totalPageCount, page + 1) : Math.max(1, page - 1)
    const response = await getRecipes({ q: '', page: `${nextPage}`, perPage })
    setPage(nextPage)
    setRecipes(response.data)
  }

  if (!recipes) {
    return <div>You have no saved recipes</div>
  }


  return (
    <>
      <ul className="divide-y divide-slate-200 mb-4">
        {recipes.map(recipe => (
          <li key={recipe.id} className="group flex justify-between items-center p-2 gap-3">
            <Link className="grow space-x-2" href={`/recipes/${recipe.id}`}>
              <span>{recipe.name}</span>
              {recipe.is_public && <span className="text-green-700 text-sm">(public)</span>}
            </Link>
            <Link href={`/recipes/${recipe.id}/edit`} className="opacity-0 group-hover:opacity-100 hover:text-slate-800 text-slate-400 transition">
              <PencilIcon className="w-4 h-4 "/>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex justify-center items-center gap-4">
        <Button variant="ghost" onClick={goToPage('prev')}><CaretLeftIcon className="w-5 h-5" /></Button>
        <Button variant="ghost" onClick={goToPage('next')}><CaretRightIcon className="w-5 h-5" /></Button>
      </div>
    </>
  )
}