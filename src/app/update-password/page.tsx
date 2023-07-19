import AppLayout from '@/components/layouts/AppLayout'
import UpdatePassword from './UpdatePassword'

export default function Page() {
  return (
    <AppLayout
      isPrivate
      className="py-4"
      withSearch={false}
    >
      <title>Update Password | Reciparse</title>
      <UpdatePassword />
    </AppLayout>
  )
}