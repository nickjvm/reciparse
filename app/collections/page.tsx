import createSupabaseServerClient from '@/lib/supabase/server'
import { DBRecipe } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import DeleteCollection from './components/DeleteCollection'
import { deleteCollection } from './actions'

export default async function Collections() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('collections').select('*, recipes(*)').order('created_at', { ascending: false })

  if (!data) {
    return 'Error'
  }
  return <div className="max-w-5xl m-auto">
    <h1 className="text-brand font-display text-3xl font-semibold text-center mb-5">My Collections</h1>
    <div className="grid grid-cols-5 gap-5">
      {data.map(collection => {
        return (
          <Link href={`/recipes/?collection=${collection.id}`} key={collection.id} className="group overflow-hidden md:hover:bg-white md:hover:ring-brand transition ring-2 ring-transparent rounded md:p-3 md:-mx-1.5 h-full">
            <div className="aspect-square grid grid-cols-2 bg-slate-50 gap-0.5 mb-3">
              {collection.recipes.filter((r: DBRecipe) => r.image).slice(0,4).map((recipe: DBRecipe, i: number) => {
                if (!recipe.image) {
                  return null
                }
                return <Image key={recipe.id} width="200" height="200" src={recipe.image} className="aspect-square object-cover" alt={`collection image ${i}`}/>
              })}
            </div>
            <div className="leading-tight text-sm line-clamp-2 mb-1 flex justify-between items-center">
              {collection.name}
              <DeleteCollection collection={collection} onConfirm={deleteCollection} />
            </div>
          </Link>
        )
      })}
    </div>
  </div>
}