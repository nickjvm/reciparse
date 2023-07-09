export interface Recipe {
  name: string
  image: string
  recipeIngredient: string[]
  recipeInstructions: RecipeInstruction[]
  notes?: string
  recipeYield: string | string[]
  prepTime?: string
  totalTime?: string
  cookTime?: string
  meta: {
    source: string
    raw_source: string
    saved?: boolean
    id: number
  }
}

interface SupaRecipe {
  id: number,
  name: string,
  url: string,
  image_url: string,
}
export interface RecipeImage {
  url: string
  '@type': 'ImageObject'
}

export type RecipeInstruction = HowToStep | HowToSection

export interface HowToStep {
  '@type': 'HowToStep'
  name?: string
  text: string
}

export interface HowToSection {
  '@type': 'HowToSection'
  name?: string,
  itemListElement: HowToStep[]
}
export interface IngredientGroup {
  heading?: string
  items: string[]
}