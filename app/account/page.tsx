import ContentContainer from '@/components/ui/templates/ContentContainer'
import AccountTabs from './components/Tabs'
import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'

export default async function AccountPage() {

  const { data: { session } } = await readUserSession()

  if (!session) {
    return redirect('/auth')
  }

  return (
    <ContentContainer>
      <AccountTabs session={session} />
    </ContentContainer>)
}