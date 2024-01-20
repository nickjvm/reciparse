import readUserSession from '@/lib/actions'
import TabNav from '../components/TabNav'
import createSupabaseServerClient from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/ui/templates/AppLayout'
import Heading from '@/components/ui/atoms/Heading'

export default async function AddRecipe() {
  const { data: { session } } = await readUserSession()
  const supabase = await createSupabaseServerClient()
  const { data: collections } = await supabase.from('collections').select()

  if (!session) {
    return redirect('/auth-server-action')
  }
  return (
    <AppLayout session={session}>
      <Heading>Add a Recipe</Heading>
      <TabNav recipe={null} collections={collections || []} />
    </AppLayout>
  )
}