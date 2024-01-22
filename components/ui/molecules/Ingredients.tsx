'use client'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

import Copy from '../atoms/Copy'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Ingredient } from '@/lib/types'

interface Props {
  ingredients: Ingredient[]
  showStickyIngredients?: boolean
}

export default function IngredientsList({ ingredients, showStickyIngredients }: Props) {
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

  return (
    <div className="md:sticky md:top-[80px] md:self-start">
      <div>
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          Ingredients
          <Copy text={ingredients.map(ing => ing.primary).join('\n')} />
        </h3>
        <ul className="print:list-disc">
          {ingredients.map((ingredient: Ingredient, i: number) => (
            <li key={i} className="border-b print:border-b-0 print:pb-0 print:mb-0 last:border-b-0 border-b-slate-200 pb-2 mb-2">
              {ingredient.primary}
              {ingredient.subtext && <em className="ml-1 text-sm italic text-slate-500">{ingredient.subtext}</em>}
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
                  {ingredients.map((ingredient, i: number) => (
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
