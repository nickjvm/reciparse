import TabNav from '../components/TabNav'
import createSupabaseServerClient from '@/lib/supabase/server'

export default async function AddRecipe() {
  const supabase = await createSupabaseServerClient()
  const { data: collections } = await supabase.from('collections').select()

  return (
    <div className="max-w-5xl m-auto">
      <h1 className="font-display text-primary text-3xl mb-6">Add a Recipe</h1>
      <TabNav recipe={null} collections={collections || []} />
    </div>
  )
}