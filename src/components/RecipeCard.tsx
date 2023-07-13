import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { decode } from 'html-entities'

import { SupaRecipe } from '@/types'

interface Props {
  recipe: SupaRecipe
  className?: string
}

export default function RecipeCard({ recipe, className }: Props) {
  return (
    <div
      className={classNames('self-stretch', className)}>
      <Link href={`/recipe/?url=${recipe.url}`} className="flex flex-col md:hover:ring-brand transition ring-2 ring-transparent rounded block p-3 -mx-1.5 h-full">
        <Image alt={recipe.name} src={recipe.image_url} width="100" height="100" className="w-full rounded aspect-square mb-3" style={{ objectFit: 'cover' }} />
        <p className="leading-tight text-sm line-clamp-2 mb-1">{decode(recipe.name)}</p>
        {recipe.url && <p className="mt-auto text-xs text-slate-500 truncate">from {new URL(recipe.url).hostname.replace('www.', '')}</p>}
      </Link>
    </div>
  )
}