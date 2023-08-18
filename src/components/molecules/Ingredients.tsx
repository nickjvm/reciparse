'use client'
import { decode } from 'html-entities'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { numericQuantity } from 'numeric-quantity'
import Fraction from 'fraction.js'

import Copy from './Copy'
import { useEffect, useRef, useState } from 'react'

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
const cleanIngredientString = (ingredient: string, multiplier: number): Ingredient => {
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

  const value = ingredient.match(/^([\d\u00BC-\u00BE\u2150-\u215E][\s-]?[\d/\u00BC-\u00BE\u2150-\u215E]*).*$/)?.[1]
  let display = ''
  if (value) {
    display = value.split('-').map(value => {
      const value2 = Number(numericQuantity(value || 0) * multiplier).toFixed(3)
      let display = value2
        .replace('.000', '')
        .replace(/^0\./, '.')
        .replace('.167', ' 1/6')
        .replace('.333', ' 1/3')
        .replace('.833', ' 5/6')
        .replace('.666', ' 2/3')

      if (display.includes('.')) {
        display = (new Fraction((Math.round(Number(numericQuantity(value || 0) * multiplier) * 16) / 16))).toFraction(true)
      }
      return display.trim()
    }).join('-')
  }

  return {
    value: display,
    // .replace(/^0\./, '.')
    // .replace('.000', '')
    // .replace('.063', ' 1/16')
    // .replace('.167', ' 1/6')
    // .replace('.125', ' 1/8')
    // .replace('.250', ' 1/4')
    // .replace('.333', ' 1/3')
    // .replace('.375', ' 3/8')
    // .replace('.500', ' 1/2')
    // .replace('.625', ' 5/8')
    // .replace(/\.66[6-7]/, ' 2/3')
    // .replace('.750', ' 3/4')
    // .replace('.875', ' 7/8').trim(),
    primary: decode(ingredient.replace(subtext, '').replace(value, '').replace(/\(\)/, '').replace(/\s([^\s]+)$/, '&nbsp;$1')).trim(),
    subtext: decode(subtext.replace(/^,?\s?/, '').replace(/\s([^\s]+)$/, '&nbsp;$1')).trim(),
  }
}

export default function IngredientsList({ ingredients, showStickyIngredients }: Props) {
  const [multiplier, setMultiplier] = useState(1)
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
        <h3 className="text-xl font-bold flex items-center gap-2">
          Ingredients
          <Copy text={ingredients.map(s => cleanIngredientString(s, multiplier)).map(i => i.value + ' ' + i.primary).join('\n')} />
        </h3>
        <div className="space-x-1 flex items-center mb-4">
          <span className="text-xs">
            batch size:
          </span>
          <div className="grow flex space-x-1 rounded-lg bg-slate-100 p-0.5 my-2" role="tablist" aria-orientation="horizontal">
            {[{value: .5, label: 'half'}, {value: 1, label: 'normal'}, {value: 2, label: 'double'}, {value: 3, label: 'triple'}].map(m => (
              <button onClick={() => setMultiplier(m.value)} key={m.value} className={classNames('grow text-center rounded-md py-1 text-xs font-medium', m.value === multiplier && 'shadow bg-white')}>
                <span className="text-slate-900">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
        <ul className={classNames(ingredients.length > 8 && 'print:columns-2', 'print:mb-4')}>
          {ingredients.map(s => cleanIngredientString(s, multiplier)).map((ingredient: Ingredient, i: number) => (
            <li key={i} className="leading-tight border-b print:border-b-0 print:pb-0 print:mb-0 last:border-b-0 border-b-slate-200 pb-2 mb-2">
              {ingredient.value ? `${ingredient.value} ` : ''}
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
                  </div>
                  <ChevronUpIcon className={open ? 'w-5 rotate-180 transform' : 'w-5'} />
                </h3>
              </Disclosure.Button>
              <Disclosure.Panel>
                <ul className="px-5 overflow-auto max-h-80">
                  {ingredients.map(s => cleanIngredientString(s, multiplier)).map((ingredient, i: number) => (
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
