'use client'

import Image from 'next/image'
import { Fragment, useEffect, useRef, useState } from 'react'
import { decode } from 'html-entities'

import { useAuthContext } from '@/context/AuthContext'

import { Squares2X2Icon } from '@heroicons/react/24/outline'

import IngredientsList from '@/components/molecules/Ingredients'
import Time from '@/components/molecules/Time'
import CookMode from '@/components/molecules/CookMode'
import Nutrition from '@/components/molecules/Nutrition'
import RecipeNotes from '@/components/molecules/RecipeNotes'
import SaveRecipe from '@/components/atoms/SaveRecipe'
import Print from '@/components/atoms/Print'
import { HowToSection, Recipe, SavedRecipe, SupaRecipe } from '@/types'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import request from '@/lib/api'
import debug from '@/lib/debug'
import { useDebounce } from '@/hooks/useDebounce'
import { saveSearchToDb, saveSearchToLocalStorage } from '@/lib/searchHistory'
import classNames from 'classnames'

interface Props {
  recipe: Recipe
}

export default function Recipe({ recipe }: Props) {
  const { user } = useAuthContext()
  const searchParams = useSearchParams()
  const [saved, setSaved] = useState<SavedRecipe|null>(null)
  const [showStickyIngredients, setShowStickyIngredients] = useState(false)
  const showStickyIngredients_debounced = useDebounce<boolean>(showStickyIngredients, 500)

  const directionsRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const payload: SupaRecipe = {
      id: recipe.meta.id,
      url: recipe.meta.raw_source,
      image_url: recipe.image,
      name: recipe.name,
    }

    saveSearchToLocalStorage(payload)
    if (user) {
      saveSearchToDb(payload)
    }

    getSaved()
  }, [user])

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

  const getSaved = async () => {
    if (user) {
      try {
        const { data }: { data: null|SavedRecipe} = await request(`/api/recipes/saved/${recipe.meta.id}`)
        setSaved(data)
      } catch (e) {
        debug(e)
      }
    }
  }

  const parseYield = (recipeYield: undefined |string | string[], i?: number, recipeYields?: string[]): string|undefined => {
    if (Array.isArray(recipeYield)) {
      return Array.from(new Set(recipeYield.map(parseYield).filter(v => v))).join(', ')
    } else {
      const recipeYieldNum = Number(recipeYield)
      if (!isNaN(recipeYieldNum)) {
        if (recipeYieldNum > 0 && !recipeYields?.find(y => y.startsWith(`${recipeYieldNum} `))) {
          return `${recipeYieldNum} serving${recipeYieldNum !== 1 ? 's' : ''}`
        }
        return ''
      } else if (recipeYield) {
        let finalYield = recipeYield.replace(/^0/, '').replace(/\.$/, '').trim()
        const dozenMatch = finalYield.match(/([0-9.]+) dozen/)
        if (dozenMatch) {
          finalYield = `${Number(dozenMatch[1]) * 12} servings`
        }
        return finalYield
      }
    }
  }

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

  return (
    <main className="print:bg-white print:min-h-0 md:p-4 md:pb-6 print:p-0 max-w-5xl mx-auto">
      <div className="m-auto max-w-3xl p-4 md:p-8 print:p-0 md:rounded-md ring-brand-alt md:ring-2 print:ring-0 print:shadow-none shadow-lg bg-white">
        <div>
          <header className="grid auto-rows-auto md:grid-cols-12 print:grid-cols-12 gap-4 mb-4">
            {recipe.image && (
              <div className="relative w-full md:col-span-3 print:col-span-3">
                <Image className="w-full rounded aspect-square" style={{ objectFit: 'cover' }} alt={recipe.name} width={150} height={150} src={recipe.image} />
              </div>
            )}
            <div className={classNames(recipe.image ? 'md:col-span-9 print:col-span-8' : 'mb-4 col-span-12')}>
              <div className="mb-4">
                <h2 className="font-display text-brand-alt text-3xl font-bold">{decode(recipe.name)}</h2>
                <p className="text-slate-500 text-sm print:hidden">from <Link target="_blank" href={recipe.meta.raw_source}>{recipe.meta.source}</Link></p>
                <p className="text-slate-500 text-sm hidden print:block">{searchParams.get('url')}</p>
              </div>
              <div className="flex gap-4 flex-wrap">
                {recipe.recipeYield && (
                  <span className="inline-flex text-sm md:text-base ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded">
                    <Squares2X2Icon className="w-5"/>
                    <p className="max-w-[200px] truncate" title={parseYield(recipe.recipeYield)}>{parseYield(recipe.recipeYield)}</p>
                  </span>
                )}

                <Time prepTime={recipe.prepTime} cookTime={recipe.cookTime} totalTime={recipe.totalTime} />
                <SaveRecipe id={recipe.meta.id} saved={!!saved?.isFavorite} onChange={setSaved} />
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
              {saved?.isFavorite && <RecipeNotes id={recipe.meta.id} value={saved?.notes} />}
              <div className="mt-4">
                <Nutrition
                  data={recipe.nutrition}
                  ingredientsList={recipe.recipeIngredient}
                  recipeYield={parseYield(recipe.recipeYield)}
                  source={recipe.meta.source}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={endRef} />
    </main>
  )
}
