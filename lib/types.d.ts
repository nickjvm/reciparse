import { Session } from '@supabase/supabase-js'
import { Json } from './supabase/types/supabase'

export type NextPage = {
  params: {
    session: Session|null
    [key: string]: string
   }
  searchParams: { [key: string]: string | undefined }
}

export type Ingredient = {
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
}