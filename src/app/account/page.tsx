'use client'

import AppLayout from '@/components/layouts/AppLayout'
import MyAccount from './account-form'

export default function Page() {
  return (
    <AppLayout isPrivate withSearch={false} className="py-4">
      <title>My Account | Reciparse</title>
      <MyAccount />
    </AppLayout>
  )
}
