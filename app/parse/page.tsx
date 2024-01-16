import React from 'react'
import { parseRecipe } from './actions'
import { InstructionSection, NextPage } from '@/lib/types'
import Image from 'next/image'
import { cn, parseDuration } from '@/lib/utils'
import Link from 'next/link'
import CookMode from '@/components/ui/CookMode'
import { Button } from '@/components/ui/button'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import Print from '@/components/ui/Print'
import SaveRecipe from '@/components/ui/SaveRecipe'
import ShareRecipe from '@/components/ui/ShareRecipe'

export default async function Page({ searchParams }: NextPage) {
  try {
    const recipe = await parseRecipe(searchParams.url)

    const prepTime = parseDuration(recipe.prepTime || 'PT0H0M')
    const cookTime = parseDuration(recipe.cookTime || 'PT0H0M')
    const totalTime = parseDuration(recipe.totalTime || 'PT0H0M')

    const renderNutritionValue = (value: string) => {
      return value.replace('milli', 'm').replace(/grams?/, 'g')
    }

    return (
      <div className="m-auto max-w-5xl">
        <div className="grid grid-cols-12 gap-5">
          {recipe.image && <Image className="aspect-square object-cover col-span-2 rounded-md" src={recipe.image} alt={recipe.name} width="500" height="500" />}
          <div className={cn('bg-slate-50 p-4 print:p-0 rounded-md', recipe.image ? 'col-span-10' : 'col-span-12 px-6')}>
            <div className="mb-3">
              <h1 className="text-brand font-display text-3xl font-semibold">{recipe.name}</h1>
              {searchParams.url && <p className="text-slate-600 text-sm hover:underline line-clamp-1">
                <Link target="_blank" href={searchParams.url}>{searchParams.url}</Link>
              </p>}
            </div>
            <div className="flex space-x-3">
              {!!prepTime && (
                <div className="min-w-[150px]">
                  <h3 className="font-semibold">Prep Time</h3>
                  {prepTime}
                </div>
              )}
              {!!cookTime && (
                <div className="min-w-[150px]">
                  <h3 className="font-semibold">Cook Time</h3>
                  {cookTime}
                </div>
              )}
              {!!totalTime && (
                <div className="min-w-[150px]">
                  <h3 className="font-semibold">Total Time</h3>
                  {totalTime}
                </div>
              )}
              {!!recipe.yield && (
                <div className="min-w-[150px]">
                  <h3 className="font-semibold">Recipe Yield</h3>
                  {recipe.yield} serving{recipe.yield !== 1 && 's'}
                </div>
              )}
            </div>
            <div className="space-x-3 mt-3">
              <Print />
              <SaveRecipe recipe={recipe} source={searchParams.url} />
              <ShareRecipe recipe={recipe} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-16 gap-6 mt-4">
          <div className="col-span-6">
            <div className="sticky top-[80px]">
              <h2 className="text-2xl font-semibold">Ingredients</h2>
              <ul className="divide-y print:divide-y-0 print:list-disc print:pl-5">
                {recipe.ingredients.map((ingredient, i) => {
                  if (typeof ingredient === 'string') {
                    return <li className="py-2 print:py-0" key={i}>{ingredient}</li>
                  }
                  return (
                    <li className="py-2 print:py-0" key={i}>
                      {ingredient.primary}
                      {ingredient.subtext ? <span className="text-slate-500 text-sm ml-1">{ingredient.subtext}</span> : null}
                    </li>
                  )})}
              </ul>
            </div>
          </div>
          <div className="space-y-8 print:space-y-2 col-span-8 print:col-span-10">
            <CookMode />
            <div className="space-y-3 print:space-y-1">
              {recipe.instructions.map((_section, i) => {
                const section = _section as unknown as InstructionSection
                return (
                  <React.Fragment key={i}>
                    <h2 key={i} className="text-2xl font-semibold mb-2">{section.name}</h2>
                    <ol className={cn('space-y-2 print:space-y-0', section.steps.length > 1 && 'list-decimal pl-8')}>
                      {section.steps.map((step, j) => {
                        return <li key={j}>{step.name !== step.text && <strong>{step.name}</strong>} {step.text}</li>
                      })}
                    </ol>
                  </React.Fragment>
                )
              })}
            </div>
            {recipe.nutrition && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Nutrition</h2>
                <div className="text-sm mb-3">Note: The information shown below is an estimate based on available ingredients and preparation. It should not be considered a substitute for a professional advice.</div>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {recipe.nutrition.servingSize && <span className="font-bold col-span-2">Serving size: {recipe.nutrition.servingSize}</span>}
                  {recipe.nutrition.calories && <span className="font-bold col-span-2">
                    {typeof recipe.nutrition.calories === 'number' && `${recipe.nutrition.calories} calories`}
                    {typeof recipe.nutrition.calories === 'string' && (recipe.nutrition.calories.includes('cal') ? recipe.nutrition.calories : `${recipe.nutrition.calories} calories`)}
                  </span>}
                  {recipe.nutrition.fatContent && <div>
                    <span className="font-medium">Total fat: </span>
                    {renderNutritionValue(recipe.nutrition.fatContent)}
                  </div>}
                  {recipe.nutrition.saturatedFatContent && <div>
                    <span className="font-medium">Saturated fat: </span>
                    {renderNutritionValue(recipe.nutrition.saturatedFatContent)}
                  </div>}
                  {recipe.nutrition.unsaturatedFatContent && <div>
                    <span className="font-medium">Unsaturated fat: </span>
                    {renderNutritionValue(recipe.nutrition.unsaturatedFatContent)}
                  </div>}
                  {recipe.nutrition.transFatContent && <div>
                    <span className="font-medium">Trans fat: </span>
                    {renderNutritionValue(recipe.nutrition.transFatContent)}
                  </div>}
                  {recipe.nutrition.sodiumContent && <div>
                    <span className="font-medium">Sodium: </span>
                    {renderNutritionValue(recipe.nutrition.sodiumContent)}
                  </div>}
                  {recipe.nutrition.carbohydrateContent && <div>
                    <span className="font-medium">Total carbs: </span>
                    {renderNutritionValue(recipe.nutrition.carbohydrateContent)}
                  </div>}
                  {recipe.nutrition.fiberContent && <div>
                    <span className="font-medium">Fiber: </span>
                    {renderNutritionValue(recipe.nutrition.fiberContent)}
                  </div>}
                  {recipe.nutrition.sugarContent && <div>
                    <span className="font-medium">Sugar: </span>
                    {renderNutritionValue(recipe.nutrition.sugarContent)}
                  </div>}
                  {recipe.nutrition.proteinContent && <div>
                    <span className="font-medium">Protein: </span>
                    {renderNutritionValue(recipe.nutrition.proteinContent)}
                  </div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (e) {
    return <div className="max-w-xl m-auto text-center space-y-7 mt-5">
      <div>
        <Image className="inline-block mb-5 m-auto" src="/404.svg" alt="parse error" width="150" height="150" />
        <h1 className="font-display text-4xl text-primary text-center font-semibold mb-3">{(e as Error).message}</h1>
        <p>We searched high and low, but couldn&apos;t find all of the information we needed to parse the recipe.</p>
      </div>
      {searchParams.url && <Button variant="outline" size="lg">
        <Link href={searchParams.url} target="_blank" className="flex gap-2 items-center">
          Go to the original site
          <ArrowTopRightOnSquareIcon className="w-5" />
        </Link>
      </Button>}
    </div>
  }
}
