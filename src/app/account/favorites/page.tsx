import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"

import Header from "@/components/Header"

import { serverRequest } from "@/lib/api"
import { SupaRecipe } from "@/types"

export default async function Page() {
  const favorites: SupaRecipe[] = await serverRequest('/api/recipes/favorites')

  return (
    <div className="flex flex-col h-screen">
      <Header withBorder withSearch />
      <div className="grow flex flex-col">
        <div className="max-w-5xl w-full mx-auto mt-6">
          <h2 className="font-display text-center text-2xl font-bold text-brand-alt">My Favorites</h2>
          <div className="w-full p-4 flex justify-start flex-wrap align-stretch">
            {favorites.map((recipe: SupaRecipe) => (
              <div key={recipe.id} className={classNames('px-4 shrink-0 grow-0 sm:w-1/3 md:w-1/5 w-1/2 mb-4 md:mb-0 self-stretch')}>
                <Link href={`/recipe/?url=${recipe.url}`} className="md:hover:ring-brand transition ring-2 ring-transparent rounded block p-3 -mx-3 h-full">
                  <Image alt={recipe.name} src={recipe.image_url} width="100" height="100" className="w-full rounded aspect-square mb-3" style={{ objectFit: 'cover' }} />
                  <p className="text-sm line-clamp-2">{recipe.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}