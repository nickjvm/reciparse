import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { decode } from 'html-entities'

import { SupaRecipe } from '@/types'
import PlaceholderImage from './PlaceholderImage'

interface Props {
  recipe?: SupaRecipe
  className?: string
  loading?: boolean
}

export default function RecipeCard({ recipe, className, loading }: Props) {

  if (loading) {
    return (
      <div className={classNames('animate-pulse sself-stretch w-[33vw] min-w-[33vw] md:w-[19vw] md:min-w-[19vw] xl:w-auto xl:min-w-0 max-w-1/8 shrink-0 flex-1 flex-grow', className)}>
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
      <div className={classNames('self-stretch w-[33vw] min-w-[33vw] md:w-[19vw] md:min-w-[19vw] xl:w-auto xl:min-w-0 max-w-1/8 shrink-0 flex-1 flex-grow', className)}>
        <Link
          href={`/recipe/?url=${recipe.url}`}
          className="flex flex-col md:hover:bg-white md:hover:ring-brand transition ring-2 ring-transparent rounded block md:p-3 md:-mx-1.5 h-full">
          <div className="w-full rounded aspect-square mb-3 relative">
            {recipe.image_url && <Image alt={recipe.name} src={recipe.image_url} width="100" height="100" className="w-full aspect-square" style={{ objectFit: 'cover' }} />}
            {!recipe.image_url && <PlaceholderImage />}
          </div>
          <p className="leading-tight text-sm line-clamp-2 mb-1">{decode(recipe.name)}</p>
          {recipe.url && <p className="mt-auto text-xs text-slate-500 truncate">{new URL(recipe.url).hostname.replace('www.', '')}</p>}
        </Link>
      </div>
    )
  } else {
    return null
  }
}