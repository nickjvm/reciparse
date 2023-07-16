import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import { Database } from '@/types/database.types'

import withHeader from '@/components/withHeader'
import FavoritesList from './List'
import serverRequest from '@/lib/api/server'
import RecipeError from '@/components/RecipeError'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Favorites | Reciparse'
}

async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  let count = 0
  let error = false
  try {
    const response = await serverRequest('/api/recipes/favorites?count=true')
    count = response.count

    if (response.error) {
      throw response.error
    }
  } catch (e) {
    error = true
  }

  if (error) {
    return <RecipeError image="/404.svg" errorText="Something went wrong. Try again later." className="mb-6" />
  } else if (!count) {
    return <RecipeError errorTitle="Start saving!" image="/favorite.svg" errorText="Looks like you haven't saved any recipes yet." className="mb-6" />
  } else {
    return (
      <div className="max-w-5xl w-full mx-auto mt-6">
        <FavoritesList count={count} error={error} />
      </div>
    )
  }
}

export default withHeader(Page, { withSearch: true })