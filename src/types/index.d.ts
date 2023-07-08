export interface Recipe {
  id: string
  name: string
  image: string[] | RecipeImage[]
  slug: string
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
  }
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