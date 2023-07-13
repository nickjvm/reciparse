import classNames from 'classnames'
import { Metadata } from 'next'

import QuickSearch from '@/components/QuickSearch'

import serverRequest from '@/lib/api/server'
import { SupaRecipe } from '@/types'
import withHeader from '@/components/withHeader'
import RecipeCard from '@/components/RecipeCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Parse a Recipe | Reciparse'
}

async function Page() {
  const recent: SupaRecipe[] = await serverRequest('/api/recipes/random')

  return (
    <div className="flex flex-col h-full pt-8">
      <div className="grow flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-xl items-center justify-between p-4 print:px-0 md:px-6 gap-2">
          <p className="text-center text-lg mb-5">Ditch the endless scrolling, stories, ads and videos. Get exactly what you need: <em className="text-brand-alt font-semibold">the recipe</em>.</p>
          <QuickSearch size="lg" inputClassName="hover:ring-brand ring-2" autoFocus />
        </div>
        {recent && recent.length && (
          <div className="w-full mt-6">
            <h2 className="font-display text-center text-2xl font-bold text-brand-alt">Discover Recipes</h2>
            <div className="w-full p-4 flex justify-center flex-wrap align-stretch">
              {recent.map((recipe: SupaRecipe, i) => (
                <RecipeCard key={i} recipe={recipe} className={classNames(
                  'max-w-[200px] md:p-2 shrink-0 grow-0 2xl:w-[12.5%] lg:w-[16.667%] sm:w-1/4 w-1/2',
                  i > 5 && 'hidden sm:block lg:hidden 2xl:block'
                )} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default withHeader(Page, { withSearch: false })