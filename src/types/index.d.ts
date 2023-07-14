export interface Recipe {
  error?: boolean
  message?: string
  name: string
  image: string
  recipeIngredient: string[]
  recipeInstructions: RecipeInstruction[]
  notes?: string
  recipeYield: string | string[]
  prepTime?: string
  totalTime?: string
  cookTime?: string
  nutrition?: Nutrition|null
  meta: {
    source: string
    raw_source: string
    saved?: boolean
    id: number
    isFavorite: boolean
    image: {
      url: string
      width: number
      height: number
    }
  }
}

export interface Nutrition {
  '@type': 'NutritionInformation'
  calories: number|string|null
  unsaturatedFatContent: string|null
  carbohydrateContent: sring|null
  cholesterolContent: string|null,
  fatContent:  string|null
  fiberContent:  string|null
  proteinContent:  string|null
  saturatedFatContent:  string|null
  sodiumContent:  string|null
  sugarContent:  string|null
  transFatContent: string|null
}

export interface SupaRecipe {
  id: number,
  name: string,
  url: string,
  image_url: string,
}

export type AuthAction = 'signup'|'signin'|'reset'|'reset_sent'
export interface RecipeImage {
  url: string
  '@type': 'ImageObject'
}

type RecipeInstruction = HowToSection

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

export interface EdamamResponse {
  nutrition: Nutrition,
  servings: number,
  error?: Error
}
