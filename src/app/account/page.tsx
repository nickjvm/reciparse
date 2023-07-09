import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'
import AccountForm from './account-form'
import withHeader from '@/components/withHeader'

export async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: { session } } = await supabase.auth.getSession()

  return <AccountForm session={session} />
}

export default withHeader(Page, { withSearch: true })