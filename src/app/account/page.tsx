import withHeader from '@/components/withHeader'
import { Metadata } from 'next'
import MyAccount from './account-form'

export const metadata: Metadata = {
  title: 'My Account | Reciparse'
}

function Page() {
  return <MyAccount />
}

export default withHeader(Page, { withSearch: false })