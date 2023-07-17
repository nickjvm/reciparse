'use client'
import { decode } from 'html-entities'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

import Copy from './Copy'

interface Props {
  ingredients: string[]
}
export default function IngredientsList({ ingredients }: Props) {
  return (
    <div className="col-span-3 fixed left-0 right-0 bottom-0 md:static print:static">
      <div className="hidden md:block print:block">
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
      <Disclosure>
        {({ open }) => (
          <div className={classNames('block print:hidden md:hidden border-t-2 transition bg-white border-brand')}>
            <Disclosure.Button className={open ? 'py-2 mb-2 w-full text-left' : 'py-2 w-full text-left'}>
              <h3 className="px-5 text-lg font-bold flex justify-between">
                <div className="flex items-center gap-2">
                  Ingredients
                  <Copy preventBubble text={ingredients.join('\n')} />
                </div>

                <ChevronDownIcon className={open ? 'w-5 rotate-180 transform' : 'w-5'} />
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
  )
}
