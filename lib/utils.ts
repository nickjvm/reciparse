import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { parse } from 'iso8601-duration'
import { stripHtml } from 'string-strip-html'

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
