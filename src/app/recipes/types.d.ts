import { HowToSection } from '@/types'

export type FormValues = {
  public?: boolean
  id?: number
  handle?: string
  name: string
  recipeInstructions: HowToSection[],
  file?: File
  image: string
  recipeYield: number
  prepTime: Duration
  cookTime: Duration
  recipeIngredient: string
}