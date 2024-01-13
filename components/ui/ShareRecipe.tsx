'use client'
import { Recipe } from '@/lib/types'
import { Button } from './button'
import { ShareIcon } from '@heroicons/react/24/outline'

type Props = {
  recipe: Recipe
}
export default function ShareRecipe({ recipe }: Props) {
  if (!global.window?.navigator?.canShare) {
    return null
  }

  const shareData = {
    title: recipe.name,
    text: 'Check out this recipe on Reciparse',
    url: window.location.href,
  }

  const shareRecipe = async () => {
    await window.navigator.share(shareData)
  }

  return (
    <Button
      className="print:hidden hidden sm:inline-flex gap-2"
      onClick={shareRecipe}
    >
      <ShareIcon className="w-5 group-hover:stroke-brand-alt group-hover:fill-white" />
      <span>Share</span>
    </Button>
  )
}