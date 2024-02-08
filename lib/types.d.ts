import { Session } from '@supabase/supabase-js'
import { Json } from './supabase/types/supabase'
import { Ingredient as ParsedIngredient } from 'parse-ingredient'
export type NextPage = {
  params: {
    session: Session|null
    [key: string]: string
   }
  searchParams: { [key: string]: string | undefined }
}

export type Ingredient = ParsedIngredient & {
  primary: string;
  subtext?: string;
}

export type InstructionSection = {
  name: string
  steps: InstructionStep[]
}

export type InstructionStep = {
  name?: string
  text: string
}

export type HowToSection = {
  name: string,
  '@type': 'HowToSection',
  itemListElement: HowToStep[],
}

export type HowToStep = {
  name?: string,
  '@type': 'HowToStep',
  text: string,
}

export type Instructions = string[]|HowToSection[]

export type Recipe = {
  id?: string;
  name: string;
  yield?: number|null;
  prepTime?: string|null;
  cookTime?: string|null;
  totalTime?: string|null;
  ingredients: Ingredient[];
  instructions: Json[];
  nutrition?: { [key: string]: string };
  image?: string|null;
  collection_id?: string;
  collection?: Collection|null;
  source?: string|null;
}

export type DBRecipe = Omit<Recipe, 'ingredients'|'id', 'nutrition'> & {
  id: string
  ingredients: string[]
}

export type Collection = {
  id: string;
  name: string;
  recipes?: {
    count?: number
  }[]
}

export type PostgrestResponseFailure = {
  data: null,
  error: {
    message: string,
  },
  count: null,
  status: number,
  statusText: string
}

export type LocalSearchHistory = {
  id: string|number
  url: string
  name: string
  image_url: string
  type: 'parsed'|'saved'
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

type Nutrients = 'ENERC_KCAL'|'FAT'|'FASAT'|'FATRN'|'FAMS'|'FAPU'|'CHOCDF'|'CHOCDF'|'FIBTG'|'SUGAR'|'PROCNT'|'CHOLE'|'NA'|'CA'|'MG'|'K'|'FE'|'ZN'|'P'|'VITA_RAE'|'VITC'|'THIA'|'RIBF'|'NIA'|'VITB6A'|'FOLDFE'|'FOLFD'|'FOLAC'|'VITB12'|'VITD'|'TOCPHA'|'VITK1'|'WATER'|'ENERC_KCAL'
type EdamamNutrients = {
  label: string
  quantity: number
  unit: string
}
export type EdamamResponse = {
  uri: string
  yield: number
  calories: number
  totalWeight: number
  dietLabels: string[]
  healthLabels: string[]
  cautions: string[]
  totalNutrients: {
    [key in keyof typeof Nutrients]: EdamamNutrients
  }
  totalDaily: {
    [key in keyof typeof Nutrients]: EdamamNutrients
  }
  ingredients: {
    text: string
    parsed: {
      quantity: number
      measure: string
      foodMatch: string
      food: string
      foodId: string
      weight: number
      retainedWeight: number
      nutrients: {
        [key in keyof typeof Nutrients]: EdamamNutrients
      }
      measureURI: string
      status: string
    }
  }
}