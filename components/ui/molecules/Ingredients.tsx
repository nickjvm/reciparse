'use client'
import pluralize from 'pluralize'

import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { formatQuantity } from 'format-quantity'
import Copy from '../atoms/Copy'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Ingredient } from '@/lib/types'

interface Props {
  ingredients: Ingredient[]
  showStickyIngredients?: boolean
}

export default function IngredientsList({ ingredients, showStickyIngredients }: Props) {
  const [scale, setScale] = useState<number>(1)

  console.log(ingredients)
  const disclosureRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!showStickyIngredients) {
      setTimeout(() => {
        if (disclosureRef.current?.matches('[aria-expanded="true"]')) {
          disclosureRef.current.click()
        }
      }, 150)
    }
  }, [showStickyIngredients])

  const formattedIngredients = ingredients.map(ingredient => {
    const { primary, quantity, quantity2, unitOfMeasure, subtext } = ingredient
    let finalString = ''
    if (quantity) {
      finalString += formatQuantity(quantity * scale)
    }
    if (quantity2) {
      finalString += `-${formatQuantity(quantity2 * scale)}`
    }

    if (unitOfMeasure) {
      finalString += ` ${pluralize(unitOfMeasure, quantity2 ? quantity2 * scale : (quantity || 0) * scale )}`
    }

    finalString += ` ${primary}`

    return {
      isHeading: ingredient.isGroupHeader,
      primary: finalString,
      subtext
    }
  })
  return (
    <div className="md:sticky md:top-[80px] md:self-start">
      <div>
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          Ingredients

          <Copy text={formattedIngredients.filter(ing => !ing.isHeading).map(ing => ing.primary).join('\n')} />
        </h3>
        <div className="flex leading-0 font-normal text-sm mb-4">
          <span className="pr-2">Scale recipe:</span>
          <label className="cursor-pointer">
            <input className="peer hidden" type="radio" name="scale" value=".5" onChange={(e => setScale(Number(e.target.value)))} />
            <span className="peer-checked:font-medium peer-checked:bg-slate-100 peer-checked:font-mediumrounded py-1 px-2">half</span>
          </label>
          <label className="cursor-pointer">
            <input className="peer hidden" type="radio" name="scale" value="1" defaultChecked onChange={(e => setScale(Number(e.target.value)))} />
            <span className="peer-checked:font-medium peer-checked:bg-slate-100 rounded py-1 px-2">single</span>
          </label>
          <label className="cursor-pointer">
            <input className="peer hidden" type="radio" name="scale" value="2" onChange={(e => setScale(Number(e.target.value)))} />
            <span className="peer-checked:font-medium peer-checked:bg-slate-100 rounded py-1 px-2">double</span>
          </label>
          <label className="cursor-pointer">
            <input className="peer hidden" type="radio" name="scale" value="4" onChange={(e => setScale(Number(e.target.value)))} />
            <span className="peer-checked:font-medium peer-checked:bg-slate-100 rounded py-1 px-2">triple</span>
          </label>
        </div>
        <ul className={cn(ingredients.length > 8 && 'print:columns-2', 'print:mb-4')}>
          {formattedIngredients.map((ingredient, i: number) => (
            <li key={i} className={cn(
              !ingredient.isHeading && 'border-b',
              'print:border-b-0 print:pb-0 print:mb-0 last:border-b-0 border-b-slate-200 pb-2 mb-2')}>
              {ingredient.isHeading
                ? <h2 className="mt-4 font-bold">{ingredient.primary}</h2>
                : (
                  <>
                    {ingredient.primary}
                    {scale === 1 && ingredient.subtext && <em className="ml-1 text-sm italic text-slate-500">{ingredient.subtext}</em>}
                  </>
                )
              }

            </li>
          ))}
        </ul>
      </div>
      <div
        className={cn('block print:hidden md:hidden fixed bottom-0 left-0 right-0 translate-y-0 transition-transform',
          showStickyIngredients && 'z-10',
          !showStickyIngredients && 'translate-y-[100%]'
        )}>
        <Disclosure>
          {({ open }) => (
            <div className={cn('block print:hidden md:hidden border-t-2 transition bg-white border-brand')}>
              <Disclosure.Button ref={disclosureRef} className={open ? 'py-2 mb-2 w-full text-left' : 'py-2 w-full text-left'}>
                <h3 className="px-5 text-lg font-bold flex justify-between">
                  <div className="flex items-center gap-2">
                    Ingredients
                  </div>
                  <ChevronUpIcon className={open ? 'w-5 rotate-180 transform' : 'w-5'} />
                </h3>
              </Disclosure.Button>
              <Disclosure.Panel>
                <ul className="px-5 overflow-auto max-h-80">
                  {formattedIngredients.map((ingredient, i: number) => (
                    <li key={i} className="border-b last:border-b-0 border-b-slate-200 pb-2 mb-2">
                      {ingredient.primary}
                      {ingredient.subtext && <em className="ml-1.5 text-sm italic text-slate-500">{ingredient.subtext}</em>}
                    </li>
                  ))}
                </ul>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
