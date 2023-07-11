import Header from '@/components/Header'

import serverRequest from '@/lib/api/server'
import { SupaRecipe } from '@/types'

import FavoritesList from './List'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Favorites | Reciparse'
}

export default async function Page() {
  const favorites: SupaRecipe[] = await serverRequest('/api/recipes/favorites')

  return (
    <div className="flex flex-col h-screen">
      <Header withBorder withSearch />
      <div className="grow flex flex-col">
        <div className="max-w-5xl w-full mx-auto mt-6">
          <h2 className="font-display text-center text-2xl font-bold text-brand-alt">My Favorites</h2>
          <FavoritesList data={favorites} />
        </div>
      </div>
    </div>
  )
}