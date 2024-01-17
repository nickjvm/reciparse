import readUserSession from '@/lib/actions'
import TabNav from '../components/TabNav'
import createSupabaseServerClient from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AddRecipe() {
  const { data: { session } } = await readUserSession()
  const supabase = await createSupabaseServerClient()
  const { data: collections } = await supabase.from('collections').select()
  if (!session) {
    return redirect('/auth-server-action')
  }
  return (
    <div className="max-w-5xl m-auto">
      <h1 className="font-display text-primary text-3xl mb-6">Add a Recipe</h1>
      <TabNav recipe={null} collections={collections || []} />
    </div>
  )
}