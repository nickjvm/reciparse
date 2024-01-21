import readUserSession from '@/lib/actions'
import TabNav from '../components/TabNav'
import createSupabaseServerClient from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Heading from '@/components/ui/atoms/Heading'
import ContentContainer from '@/components/ui/templates/ContentContainer'

export default async function AddRecipe() {
  const { data: { session } } = await readUserSession()
  const supabase = await createSupabaseServerClient()
  const { data: collections } = await supabase.from('collections').select()

  if (!session) {
    return redirect('/auth-server-action')
  }
  return (
    <ContentContainer>
      <Heading>Add a Recipe</Heading>
      <TabNav recipe={null} collections={collections || []} />
    </ContentContainer>
  )
}