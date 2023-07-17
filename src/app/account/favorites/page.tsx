import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import { Database } from '@/types/database.types'
import serverRequest from '@/lib/api/server'

import withHeader from '@/components/hoc/withHeader'
import RecipeError from '@/components/molecules/RecipeError'

import FavoritesList from './List'

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
    return <FavoritesList count={count} error={error} />
  }
}

export default withHeader(Page, { withSearch: true })