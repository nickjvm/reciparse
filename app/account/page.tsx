import ContentContainer from '@/components/ui/templates/ContentContainer'
import AccountTabs from './components/Tabs'
import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'
import { getCollections } from './actions'
import { Collection } from '@/lib/types'
import { getRecipes } from '../recipes/actions'

export default async function AccountPage() {

  const { data: { session } } = await readUserSession()

  if (!session) {
    return redirect('/auth')
  }

  const { data: collections } = await getCollections()
  const { data: recipes, count } = await getRecipes({ page: '1', perPage: 15 })

  return (
    <ContentContainer>
      <AccountTabs
        session={session}
        collections={collections as Collection[]}
        recipes={{ recipes, count }}
      />
    </ContentContainer>)
}