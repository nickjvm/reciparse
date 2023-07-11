import withHeader from '@/components/withHeader'
import UpdatePassword from './UpdatePassword'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Update Password | Reciparse'
}

function Page() {
  return (
    <UpdatePassword />
  )
}

export default withHeader(Page, { withSearch: false })