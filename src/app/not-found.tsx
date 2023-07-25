import { Metadata } from 'next'

import AppLayout from '@/components/layouts/AppLayout'
import RecipeError from '@/components/molecules/RecipeError'

import Layout from './layout'

export const metadata: Metadata = {
  title: 'Page not found | Reciparse'
}

// infinite loop is only in development env :shrug:
// https://github.com/vercel/next.js/discussions/50429
export default function Error() {
  return (
    <Layout>
      <AppLayout withSearch>
        <RecipeError actionText="Take me home." actionUrl="/" className="max-w-xl py-8 mx-auto" type="not_found" />
      </AppLayout>
    </Layout>
  )
}
