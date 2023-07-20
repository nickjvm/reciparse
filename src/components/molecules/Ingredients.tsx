'use client'
import { decode } from 'html-entities'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

import Copy from './Copy'
import { useEffect, useRef } from 'react'

interface Props {
  ingredients: string[]
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
      }, 500)
    }
  }, [showStickyIngredients])

  return (
    <div>
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          Ingredients
          <Copy text={ingredients.join('\n')} />
        </h3>
        <ul className={classNames(ingredients.length > 8 && 'print:columns-2', 'print:mb-4')}>
          {ingredients.map((ingredient: string, i: number)=> (
            <li key={i} className="border-b print:border-b-0 print:pb-0 print:mb-0 last:border-b-0 border-b-slate-200 pb-2 mb-2">{decode(ingredient.replace(/\s([^\s]+)$/, '&nbsp;$1'))}</li>
          ))}
        </ul>
      </div>
      <div className={classNames('block print:hidden md:hidden fixed top-[100%] left-0 right-0 translate-y-0 duration-500 transition-transform', showStickyIngredients && 'z-10 -translate-y-[100%]')}>
        <Disclosure>
          {({ open }) => (
            <div className={classNames('block print:hidden md:hidden border-t-2 transition bg-white border-brand')}>
              <Disclosure.Button ref={disclosureRef} className={open ? 'py-2 mb-2 w-full text-left' : 'py-2 w-full text-left'}>
                <h3 className="px-5 text-lg font-bold flex justify-between">
                  <div className="flex items-center gap-2">
                  Ingredients
                    <Copy preventBubble text={ingredients.join('\n')} />
                  </div>

                  <ChevronUpIcon className={open ? 'w-5 rotate-180 transform' : 'w-5'} />
                </h3>
              </Disclosure.Button>
              <Disclosure.Panel>
                <ul className="px-5 overflow-auto max-h-80">
                  {ingredients.map((ingredient, i: number)=> (
                    <li key={i} className="border-b last:border-b-0 border-b-slate-200 pb-2 mb-2">{decode(ingredient.replace(/\s([^\s]+)$/, '&nbsp;$1'))}</li>
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
