import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { decode } from 'html-entities'

import { SupaRecipe } from '@/types'

interface Props {
  recipe?: SupaRecipe
  className?: string
  loading?: boolean
}

export default function RecipeCard({ recipe, className, loading }: Props) {
  if (loading) {
    return (
      <div className={classNames('animate-pulse self-stretch', className)}>
        <div className="rounded block md:p-3 md:-mx-1.5 h-full">
          <div className="bg-gray-200 aspect-square w-full rounded-lg aspect-square mb-3"></div>
          <div className="bg-gray-200 w-full rounded-full mb-2 h-4"></div>
          <div className="bg-gray-200 w-[90%] rounded-full mb-2 h-4"></div>
          <div className="bg-gray-200 w-[80%] rounded-full h-2"></div>
        </div>
      </div>
    )
  } else if (recipe) {
    return (
      <div className={classNames('self-stretch', className)}>
        <Link href={`/recipe/?url=${recipe.url}`} className="flex flex-col md:hover:ring-brand transition ring-2 ring-transparent rounded block md:p-3 md:-mx-1.5 h-full">
          <Image alt={recipe.name} src={recipe.image_url} width="100" height="100" className="w-full rounded aspect-square mb-3" style={{ objectFit: 'cover' }} />
          <p className="leading-tight text-sm line-clamp-2 mb-1">{decode(recipe.name)}</p>
          {recipe.url && <p className="mt-auto text-xs text-slate-500 truncate">{new URL(recipe.url).hostname.replace('www.', '')}</p>}
        </Link>
      </div>
    )
  } else {
    return null
  }
}