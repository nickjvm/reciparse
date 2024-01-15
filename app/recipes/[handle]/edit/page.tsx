import { NextPage } from '@/lib/types'
import TabNav from './components/TabNav'
import createSupabaseServerClient from '@/lib/supabase/server'

export default async function EditRecipe({ params }: NextPage) {
  const supabase = await createSupabaseServerClient()
  const { data: recipe } = await supabase.from('recipes').select().eq('id', params.handle).single()

  if (!recipe) {
    return null
  }

  return (
    <div className="max-w-5xl m-auto">
      <h1 className="font-display text-primary text-3xl mb-6">Edit {recipe.name} Recipe</h1>
      <TabNav recipe={recipe} />
    </div>
  )
}