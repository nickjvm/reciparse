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

interface Ingredient {
  subtext: string
  primary: string
}

/**
 * find matching closing paren based on the position of the opening paren
 * https://codereview.stackexchange.com/questions/179471/find-the-corresponding-closing-parenthesis
 */
function findClosingBracketMatchIndex(str: string, pos: number) {
  if (str[pos] != '(') {
    throw new Error('No \'(\' at index ' + pos)
  }
  let depth = 1
  for (let i = pos + 1; i < str.length; i++) {
    switch (str[i]) {
      case '(':
        depth++
        break
      case ')':
        if (--depth == 0) {
          return i
        }
        break
    }
  }
  return -1    // No matching closing parenthesis
}

/**
 * if an ingredient ends with parenthesis, find the last full set of parenthesis
 * and mark it as subtext to be styled differently. This finds and cleans the following:
 * - example ing (peeled and diced)
 * - example ing (, peeled and diced)
 * - example ing (, peeled (and diced))
 * - example ing (peeled (and diced))
 * @param ingredient
 * @returns
 */
const cleanIngredientString = (ingredient: string): Ingredient => {
  const indices = []
  let subtext = ''
  for(let i=0; i<ingredient.length;i++) {
    if (ingredient[i] === '(') indices.push(i)
  }

  for (let i=0; i<indices.length;i++) {
    const endingIndex = findClosingBracketMatchIndex(ingredient, indices[i])
    const phrase = ingredient.substring(indices[i] + 1, endingIndex)
    subtext = phrase
    if (phrase.indexOf('(') > -1) {
      break
    }
  }

  return {
    primary: decode(ingredient.replace(subtext, '').replace(/\(\)/, '')).trim(),
    subtext: decode(subtext.replace(/^,?\s?/, '')).trim(),
  }
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
    <div>
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          Ingredients
          <Copy text={ingredients.join('\n')} />
        </h3>
        <ul className={classNames(ingredients.length > 8 && 'print:columns-2', 'print:mb-4')}>
          {ingredients.map(cleanIngredientString).map((ingredient: Ingredient, i: number) => (
            <li key={i} className="border-b print:border-b-0 print:pb-0 print:mb-0 last:border-b-0 border-b-slate-200 pb-2 mb-2">
              {ingredient.primary}
              {ingredient.subtext && <em className="ml-1 text-sm italic text-slate-500">{ingredient.subtext}</em>}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={classNames('block print:hidden md:hidden fixed bottom-0 left-0 right-0 translate-y-0 transition-transform',
          showStickyIngredients && 'z-10',
          !showStickyIngredients && 'translate-y-[100%]'
        )}>
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
                  {ingredients.map(cleanIngredientString).map((ingredient, i: number) => (
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
