'use server'

import fetch from 'node-fetch'
import { decode } from 'html-entities'
import { HTMLElement, parse } from 'node-html-parser'

import { findClosingBracketMatchIndex, isValidUrl, pick, stripTags } from '@/lib/utils'
import { HowToSection, HowToStep, Ingredient } from '@/lib/types'

type Recipe = {
  name: string;
  yield: number;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  ingredients: Ingredient[];
  instructions: HowToSection[];
  nutrition?: { [key: string]: string };
  image: string;
}

const isPinterestLink = (location: URL) => location.hostname === 'www.pinterest.com' || location.hostname === 'pin.it'

function parseYield(recipeYield: string[]|string): number {
  if (Array.isArray(recipeYield)) {
    return Number(`${Array.from(new Set(recipeYield.map(parseYield).filter((v) => v)))[0]}`)
  }

  const recipeYieldNum = Number(recipeYield)
  if (!Number.isNaN(recipeYieldNum)) {
    return recipeYieldNum
  }

  if (recipeYield) {
    let finalYield = recipeYield.replace(/^0/, '').replace(/\.$/, '').trim()
    const dozenMatch = finalYield.match(/([0-9.]+) dozen/)
    if (dozenMatch) {
      finalYield = `${Number(dozenMatch[1]) * 12}`
    } else {
      const match = recipeYield.match(/\d+/)
      if (match) {
        finalYield = match[1]
      }
    }
    return Number(finalYield)
  }
  return 0
}

type ImageObj = {
  url: string
}

function getRecipeImage(image: ImageObj|string|string[]): string {
  if (!image) {
    return ''
  }

  let imageUrl = ''
  if (typeof image === 'string') {
    imageUrl = image
  } else if (Array.isArray(image)) {
    imageUrl = image.map(getRecipeImage).find(v => v) || ''
  } else if (image.url) {
    imageUrl = image.url
  }

  if (imageUrl) {
    imageUrl = imageUrl.replace(/^https?:/, 'https:')
  }

  return imageUrl
}


/**
 * if an ingredient ends with parenthesis, find the last full set of parenthesis
 * and mark it as subtext to be styled differently. This finds and cleans the following:
 * - example ing (peeled and diced)
 * - example ing (, peeled and diced)
 * - example ing (, peeled (and diced))
 * - example ing (peeled (and diced))
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
    primary: decode(ingredient.replace(subtext, '').replace(/\(\)/, '').replace(/\s([^\s]+)$/, '&nbsp;$1')).trim().replace(/,$/, ''),
    subtext: decode(subtext.replace(/^,?\s?/, '').replace(/\s([^\s]+)$/, '&nbsp;$1')).trim(),
  }
}

function getRecipeIngredients(ingredients: string[]): Ingredient[] {
  if (!ingredients) {
    return []
  }

  return ingredients.map((ingredient) => {
    const amount = ingredient.match(/^[\d.]+/)
    let finalIngredient = ingredient
    if (amount) {
      finalIngredient = finalIngredient
        .replace(/^[\d.]+/, `${
          parseFloat(amount[0]).toFixed(2)
            .replace('.00', '')
            .replace(/.([1-9])0$/, '.$1')
        }`)
    }
    return finalIngredient
  }).filter((r) => r.trim()).map(cleanIngredientString)
}

function getRecipeInstructions(instructions?: string|string[]|HowToStep[]|HowToSection[]): HowToSection[] {
  if (!instructions) {
    return []
  }

  if (typeof instructions === 'string') {
    return [{
      '@type': 'HowToSection',
      name: 'Instructions',
      itemListElement: instructions
        .replaceAll(',    ', '\n\n')
        .replaceAll('&nbsp;', ' ')
        .split('\n\n').map((step) => ({
          '@type': 'HowToStep',
          text: step.replace(/\d+[.\s]+/, ''),
        }))
    }]
  }

  const steps = instructions.reduce((acc: HowToSection[], _instruction) => {
    let instruction = _instruction

    if (typeof instruction === 'string') {
      acc[0].itemListElement.push({
        '@type': 'HowToStep',
        text: stripTags(instruction),
      })
    } else if (instruction['@type'] === 'HowToStep') {
      const allInOne = instruction.text.match(/\d\.\s/g)
      if (allInOne) {
        allInOne.forEach((counter, i) => {
          instruction = instruction as HowToStep
          const start = instruction.text.indexOf(counter) + 2
          const end = allInOne[i + 1]
            ? instruction.text.indexOf(allInOne[i + 1])
            : instruction.text.length
          const text = instruction.text.slice(start, end).trim()
          acc[0].itemListElement.push({
            '@type': 'HowToStep',
            text: stripTags(text),
          })
        })
      } else {
        acc[0].itemListElement.push({
          '@type': 'HowToStep',
          name: stripTags(instruction.name) === stripTags(instruction.text)
            ? undefined
            : stripTags(instruction.name),
          text: stripTags(instruction.text),
        })
      }
    } else if (instruction['@type'] === 'HowToSection') {
      instruction = {
        ...instruction,
        itemListElement: instruction.itemListElement.map((item) => ({
          ...item,
          name: stripTags(item.name),
          text: stripTags(item.text),
        })),
      }
      acc.push(instruction)
    }
    return acc
  }, [{
    name: 'Directions',
    '@type': 'HowToSection',
    itemListElement: [],
  }])

  return steps
}


function getRecipeNutrition(nutrition: { [key: string]: string }) {
  if (nutrition) {
    return Object.entries(nutrition).reduce((acc: { [key: string]: string }, [key, value]) => {
      let newValue
      if (key !== '@type' && typeof value === 'string') {
        // normalize nutrition values, keeping unit of measure (g or mg)
        // and removing any other labels or text
        newValue = value.trim().replaceAll(/^([0-9]+\w*m?g).*/g, '$1')
        newValue = newValue.replaceAll(/k?cals?$/g, 'calories')
      }

      acc[key] = newValue || value
      return acc
    }, {})
  }
}

export async function parseRecipe(url?: string): Promise<Recipe> {
  if (!url || !isValidUrl(url)) {
    throw new Error('The URL provided is invalid.')
  }


  const responseHtml = await fetch(url).then((r) => {
    if (r.ok) {
      return r.text()
    } else {
      switch (r.status) {
        case 404: {
          throw new Error('404: Recipe Not Found.')
        }
        case 403:
        case 401: {
          throw new Error('The URL provided is blocking Reciparse.')
        }
        default: {
          throw new Error('Unable to access the URL.')
        }
      }
    }
  })

  const document = parse(responseHtml)

  if (isPinterestLink(new URL(url))) {
    // try to get the final clickthrough URL of the recipe and parse that
    // instead of the intermediate pinterest link
    const clickthrough = document.querySelector('meta[property="og:see_also"]')?.getAttribute('content')
    // make sure we don't get into an infinite loop of pinterest linking
    if (clickthrough && !isPinterestLink(new URL(clickthrough))) {
      return parseRecipe(clickthrough)
    }
  }

  const recipe = {
    '@content': 'https://schema.org',
    '@type': 'Recipe',
    name: '',
    image: '',
    prepTime: 'PT0M',
    cookTime: 'PT0M',
    totalTime: 'PT0M',
    recipeYield: '',
    nutrition: {},
    recipeIngredient: [],
    recipeInstructions: [],
  }

  const structuredData: HTMLElement[] = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
  // Adding .flat() to the line below handles the most common edge cases I've found so far!
  const structuredDataJson = structuredData.map((node) => JSON.parse(node.innerHTML.trim().replace(/^(\/\/\s*)?<!\[CDATA\[|(\/\/\s*)?\]\]>$/g, '')))
    .flat()
    .map((n) => n['@graph'] || n)
    .flat()
  let recipeData = structuredDataJson.find((schema) => schema['@type'] === 'Recipe' || schema['@type'].includes('Recipe'))

  if (!recipeData) {
    const itemprops = Array.from(document.querySelectorAll('[itemprop]'))
      .filter((el) => Object.keys(recipe).includes(el.getAttribute('itemprop') || ''))

    if (itemprops.length) {
      recipeData = itemprops.reduce((acc: { [key: string]: string[]|string }, item) => {
        const key = item.getAttribute('itemprop')

        if (!key) {
          return acc
        }

        if (!acc[key]) {
          acc[key] = []
        }

        switch (key) {
          case 'image': {
            (acc[key] as string[]).push(item.getAttribute('src') || item.getAttribute('content') || item.getAttribute('href') || '')
            break
          }
          case 'cookTime':
          case 'prepTime':
          case 'totalTime': {
            acc[key] = item.getAttribute('datetime') || ''
            break
          }
          case 'ingredients':
          case 'recipeInstructions': {
            (acc[key] as string[]).push(stripTags(item.innerHTML, { ignoreTags: [], stripTogetherWithTheirContents: ['sup', 'sub'] }).replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, ''))
            break
          }
          case 'name': {
            if (!acc.name[0] || acc.name[0].length < item.textContent.trim().length) {
              acc.name = item.textContent.trim() || document.querySelector('title')?.textContent || ''
            }
            break
          }
          default: {
            acc[key] = item.textContent.trim()
          }
        }

        if (Array.isArray(acc[key])) {
          acc[key] = (acc[key] as string[]).filter(v => v)
        }

        return acc
      }, {})
    } else {
      throw new Error('Unable to find a recipe.')
    }
  }

  if (!recipeData.recipeIngredient) {
    recipeData.recipeIngredient = recipeData.ingredients
  }

  if (!recipeData.image) {
    recipeData.image = document.querySelector('meta[property="og:image"]')?.getAttribute('content')
  }

  const data = {
    ...recipe,
    ...pick(recipeData, ['name', 'prepTime', 'cookTime', 'totalTime']),
    ingredients: getRecipeIngredients(recipeData.recipeIngredient),
    instructions: getRecipeInstructions(recipeData.recipeInstructions),
    nutrition: getRecipeNutrition(recipeData.nutrition),
    image: getRecipeImage(recipeData.image),
    yield: parseYield(recipeData.recipeYield),
  }

  if (!data.ingredients || data.ingredients.length === 0) {
    throw new Error('Unable to find recipe ingredients.')
  } else if (!data.instructions || data.instructions.length === 0) {
    throw new Error('Unable to find recipe instructions.')
  } else if (!data.name) {
    throw new Error('Unable to find a recipe name.')
  }
  return data
}