import { Metadata } from 'next'

import QuickSearch from '@/components/molecules/QuickSearch'
import RandomRecipes from '@/components/molecules/RandomRecipes'
import withHeader from '@/components/hoc/withHeader'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Parse a Recipe | Reciparse'
}

function Page() {
  return (
    <div className="flex flex-col h-full pt-8">
      <div className="grow flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-xl items-center justify-between p-4 print:px-0 md:px-6 gap-2">
          <p className="text-center text-lg mb-5">Ditch the endless scrolling, stories, ads and videos. Get exactly what you need: <em className="text-brand-alt font-semibold">the recipe</em>.</p>
          <QuickSearch size="lg" inputClassName="hover:ring-brand ring-2" autoFocus />
        </div>
        <RandomRecipes />
      </div>
    </div>
  )
}

export default withHeader(Page, { withSearch: false, fullWidth: true })