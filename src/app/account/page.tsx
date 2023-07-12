import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import withHeader from '@/components/withHeader'

import MyAccount from './account-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My Account | Reciparse'
}

async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  return <MyAccount />
}

export default withHeader(Page, { withSearch: false })
