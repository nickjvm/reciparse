import { Metadata } from 'next'

import QuickSearch from '@/components/molecules/QuickSearch'
import RandomRecipes from '@/components/molecules/RandomRecipes'
import AppLayout from '@/components/layouts/AppLayout'
import SearchHistory from '@/components/molecules/SearchHistory'

export const metadata: Metadata = {
  title: 'Parse a Recipe | Reciparse'
}

export default function Page() {
  return (
    <AppLayout withSearch={false} fullWidth>
      <div className="flex flex-col h-full">
        <div className="grow flex flex-col items-center justify-center">
          <div className="mx-auto w-full items-center justify-between p-4 print:px-0 gap-2 bg-gradient-to-br from-brand to-35% to-brand-alt">
            <div className="w-full max-w-5xl mx-auto py-12 md:py-24 md:px-6">
              <h1 className="text-2xl md:text-5xl font-display text-white max-w-2xl">
                Ditch the endless scrolling, stories, ads and videos. Get exactly what you need:
                <em className="block italic">the recipe.</em>
              </h1>
              <div className="max-w-xl mt-8">
                <QuickSearch size="lg" inputClassName="hover:ring-brand ring-2" autoFocus placeholder="Paste a recipe URL" />
              </div>
            </div>
          </div>
          <div className="w-full space-y-6 pb-5 py-7">
            <SearchHistory />
            <RandomRecipes title="Revisit Your Favorites" source="favorites" className="bg-gray-50 -mt-7 py-7 shadow-sm" />
            <RandomRecipes title="Discover New Recipes" />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}