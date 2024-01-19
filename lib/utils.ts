import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { parse } from 'iso8601-duration'
import { stripHtml } from 'string-strip-html'
import { Ingredient } from './types'
import { decode } from 'html-entities'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidUrl(url?: string) {
  try {
    new URL(url || '')
    return true
  } catch (e) {
    return false
  }
}

/**
 * find matching closing paren based on the position of the opening paren
 * https://codereview.stackexchange.com/questions/179471/find-the-corresponding-closing-parenthesis
 */
export function findClosingBracketMatchIndex(str: string, pos: number) {
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
 */
export const cleanIngredientString = (ingredient: string): Ingredient => {
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
    primary: decode(ingredient.replace(subtext, '').replace(/\(\)/, '').replace(/\s([^\s]+)$/, '&nbsp;$1')).trim().replace(/,$/, ''),
    subtext: decode(subtext.replace(/^,?\s?/, '').replace(/\s([^\s]+)$/, '&nbsp;$1')).trim(),
  }
}

export function parseDuration(isoDuration: string): string|null {
  let config = {
    days: 0,
    hours: 0,
    minutes: 0,
  }

  try {
    const duration = parse(isoDuration || 'PT0M')
    config = {
      days: duration.days || 0,
      hours: duration.hours || 0,
      minutes: duration.minutes || 0,
    }

    if (config.minutes >= 60) {
      const additionalHours = Math.floor(config.minutes / 60)
      config.hours += additionalHours
      config.minutes -= additionalHours * 60
    }

    if (config.hours >= 24) {
      const additionalDays = Math.floor(config.hours / 24)
      config.days += additionalDays
      config.hours -= additionalDays * 24
    }
  } catch (e) {
    console.log('error parsing duration')
  }

  if (config.days || config.hours || config.minutes) {
    return [
      config.days ? `${config.days} day${config.days === 1 ? '' : 's'}` : false,
      config.hours ? `${config.hours} hr${config.hours === 1 ? '' : 's'}` : 0,
      config.minutes ? `${config.minutes} min${config.minutes === 1 ? '' : 's'}` : false ].filter(v => v).join(', ')
  }

  return null
}

const defaultOpts = {
  ignoreTags: ['strong', 'b', 'em', 'ol', 'ul', 'li'],
  stripTogetherWithTheirContents: ['sup', 'sub'],
}

export function stripTags(text = '', opts = defaultOpts) {
  return stripHtml(text, opts).result
}
