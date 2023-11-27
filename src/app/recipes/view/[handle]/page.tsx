'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import request from '@/lib/api'
import { HowToSection, Recipe } from '@/types'
import AppLayout from '@/components/layouts/AppLayout'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import classNames from 'classnames'
import { decode } from 'html-entities'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import Time from '@/components/molecules/Time'
import Print from '@/components/atoms/Print'
import CookMode from '@/components/molecules/CookMode'
import IngredientsList from '@/components/molecules/Ingredients'
import NutritionInfo from '@/components/molecules/Nutrition'
import { useDebounce } from '@/hooks/useDebounce'
import { ErrorBoundary } from 'react-error-boundary'
import Button from '@/components/atoms/Button'
import { useAuthContext } from '@/context/AuthContext'
import { PencilIcon } from '@heroicons/react/24/solid'
import RecipeError from '@/components/molecules/RecipeError'

export default function MyRecipes() {
  const [recipe, setRecipe] = useState<Recipe|null>(null)
  const { handle } = useParams()
  const endRef = useRef<HTMLDivElement>(null)
  const directionsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user } = useAuthContext()
  const [showStickyIngredients, setShowStickyIngredients] = useState(false)
  const showStickyIngredients_debounced = useDebounce<boolean>(showStickyIngredients, 500)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    request(`/api/recipes/custom/${handle}`).then(({ data, error }: { data: null|Recipe, error: null|Error}) => {
      if (error) {
        setError(error.message)
      } else {
        setRecipe(data)
      }
    })
  }, [])

  useEffect(() => {
    const showHideStickyIngredients = () => {

      if (directionsRef.current && endRef.current) {
        setShowStickyIngredients(
          directionsRef.current.getBoundingClientRect().top < window.innerHeight * .66 &&
          endRef.current.getBoundingClientRect().top > window.innerHeight * .75
        )
      }
    }
    window.addEventListener('scroll', showHideStickyIngredients)

    return () => window.removeEventListener('scroll', showHideStickyIngredients)
  }, [])

  const renderInstructionSection = (section: HowToSection, i: number) => {
    return (
      <Fragment key={i}>
        {section.name && <h2 className="text-xl font-bold mb-2">{section.name}</h2>}
        {section.itemListElement.length === 1 && (
          <div key={i} className="mb-2 grid grid-cols-12">
            <span className="flex-grow col-span-11">
              {section.itemListElement[0].name && decode(section.itemListElement[0].name) !== section.itemListElement[0].text && <span className="block font-bold">{decode(section.itemListElement[0].name)}</span>}
              <span dangerouslySetInnerHTML={{ __html: section.itemListElement[0].text }} />
            </span>
          </div>
        )}
        {section.itemListElement.length > 1 && (
          <ol className="[counter-reset: step]">
            {section.itemListElement.map((step, i) => (
              <li key={i} className="mb-2 before:text-brand-alt grid grid-cols-12 before:content-[counter(step)] before:font-bold before:text-xl print:before:text-right print:before:pr-3 [counter-increment:step]">
                <span className="flex-grow col-span-11">
                  {step.name && decode(step.name) !== step.text && <span className="block font-bold">{decode(step.name)}</span>}
                  <span dangerouslySetInnerHTML={{ __html: step.text }} />
                </span>
              </li>
            ))}
          </ol>
        )}
      </Fragment>
    )
  }

  if (!recipe && !error) return

  return (
    <AppLayout withSearch>
      <ErrorBoundary fallback={<div>Error</div>} onError={console.log}>
        <main className="print:bg-white print:min-h-0 md:p-4 md:pb-6 print:p-0 max-w-5xl mx-auto">
          <div className="m-auto max-w-3xl p-4 md:p-8 print:p-0 md:rounded-md ring-brand-alt md:ring-2 print:ring-0 print:shadow-none shadow-lg bg-white">
            {error && (
              <RecipeError errorTitle="Unauthorized." actionText="Back to home" actionUrl="/" errorText="The creator of this recipe has not made it public."  />
            )}
            {!error && recipe && (
              <div>
                <header className="grid auto-rows-auto md:grid-cols-12 print:grid-cols-12 gap-4 mb-4">
                  {recipe.image && (
                    <div className="relative w-full md:col-span-3 print:col-span-3">
                      <Image className="w-full rounded aspect-square" style={{ objectFit: 'cover' }} alt={recipe.name} width={150} height={150} src={recipe.image} />
                    </div>
                  )}
                  <div className={classNames(recipe.image ? 'md:col-span-9 print:col-span-8' : 'mb-4 col-span-12')}>
                    <div className="mb-4">
                      <h2 className="font-display text-brand-alt text-3xl font-bold">
                        {decode(recipe.name)}
                        {user && user.id === recipe.user_id && <Button appearance="icon" className="opacity-40 hover:opacity-100 focus-visible:opacity-100 print:hidden" icon={<PencilIcon className="w-5" />} onClick={() => router.push(`/recipes/edit/${handle}`)} />}
                      </h2>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {recipe.recipeYield && (
                        <span className="inline-flex text-sm md:text-base ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded">
                          <Squares2X2Icon className="w-5"/>
                          <p className="max-w-[200px] truncate">{recipe.recipeYield} servings</p>
                        </span>
                      )}

                      <Time prepTime={recipe.prepTime} cookTime={recipe.cookTime} totalTime={recipe.totalTime} />
                      <Print />
                      <CookMode />
                    </div>
                  </div>
                </header>
                <div className="pt-3 md:pt-0 md:grid grid-cols-8 gap-8 pb-8 sm:pb-4 md:pb-0">
                  <div className="col-span-8 md:col-span-3 print:col-span-3 mb-3 md:mb-0">
                    <IngredientsList ingredients={recipe.recipeIngredient} showStickyIngredients={showStickyIngredients_debounced} />
                  </div>
                  <div className="col-span-8 md:col-span-5 print:col-span-5 print:mt-2" id="directions" ref={directionsRef}>
                    {recipe.recipeInstructions.map(renderInstructionSection)}
                    <div className="mt-4">
                      <NutritionInfo
                        data={recipe.nutrition}
                        ingredientsList={recipe.recipeIngredient}
                        recipeYield={recipe.recipeYield}
                        source={recipe.meta.source}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={endRef} />
        </main>
      </ErrorBoundary>
    </AppLayout>
  )
}