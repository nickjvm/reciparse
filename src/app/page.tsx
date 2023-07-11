import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

import QuickSearch from '@/components/QuickSearch'

import serverRequest from '@/lib/api/server'
import { SupaRecipe } from '@/types'
import withHeader from '@/components/withHeader'

export const dynamic = 'force-dynamic'

async function Page() {
  const recent: SupaRecipe[] = await serverRequest('/api/recipes/recent')

  return (
    <div className="flex flex-col h-full pt-8">
      <div className="grow flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-xl items-center justify-between p-4 print:px-0 md:px-6 gap-2">
          <p className="text-center text-lg mb-5">Ditch the endless scrolling, stories, ads and videos. Get exactly what you need: <em className="text-brand-alt">the recipe.</em></p>
          <QuickSearch size="lg" inputClassName="hover:ring-brand ring-2" autoFocus />
        </div>
        <div className="w-full mt-6">
          <h2 className="font-display text-center text-2xl font-bold text-brand-alt">Recent Recipes</h2>
          <div className="w-full p-4 flex justify-center flex-wrap align-stretch">
            {recent.map((recipe: SupaRecipe, i) => (
              <div
                key={recipe.id}
                className={classNames(
                  'md:p-2 shrink-0 grow-0 2xl:w-[12.5%] lg:w-[16.667%] sm:w-1/4 w-1/2 self-stretch',
                  i > 5 && 'hidden sm:block lg:hidden 2xl:block',
                )}
              >
                <Link prefetch={false} href={`/recipe/?url=${recipe.url}`} className="md:hover:ring-brand transition ring-2 ring-transparent rounded block p-3 -mx-1.5 h-full">
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

export default withHeader(Page, { withSearch: false })