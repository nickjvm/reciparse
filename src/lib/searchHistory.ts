import { SupaRecipe } from '@/types'
import request from './api'
import debug from './debug'

export const localHistory = ():  SupaRecipe[] => JSON.parse(localStorage.getItem('search_history') || '[]')

export async function saveSearchToDb(recipe: SupaRecipe) {
  try {
    await request('/api/recipes/history', {
      method: 'POST',
      body: JSON.stringify({ id: recipe.id })
    })
  } catch (e) {
    debug(e)
  }
}

export function saveSearchToLocalStorage(recipe: SupaRecipe) {
  const history = localHistory().filter((r: SupaRecipe) => r.name !== recipe.name)
  history.unshift({
    id: recipe.id,
    name: recipe.name,
    url: recipe.url,
    image_url: recipe.image_url,
  })

  history.length = Math.min(history.length, 8)
  localStorage.setItem('search_history', JSON.stringify(history))
}
