import { NextPage } from '@/lib/types'
import TabNav from '../../components/TabNav'
import createSupabaseServerClient from '@/lib/supabase/server'
import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'
import Heading from '@/components/ui/atoms/Heading'
import ContentContainer from '@/components/ui/templates/ContentContainer'

export default async function EditRecipe({ params }: NextPage) {
  const { data } = await readUserSession()

  if (!data?.session) {
    redirect('/auth-server-action')
  }

  const supabase = await createSupabaseServerClient()
  const { data: recipe } = await supabase.from('recipes').select().eq('id', params.handle).single()
  const { data: collections } = await supabase.from('collections').select()

  if (!recipe) {
    // TODO: UI Error handling
    return null
  }

  return (
    <ContentContainer>
      <Heading>Edit {recipe.name} Recipe</Heading>
      <TabNav recipe={recipe} collections={collections || []} />
    </ContentContainer>
  )
}