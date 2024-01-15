export type NextPage = {
  params: { [key: string]: string }
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
  yield: number;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  ingredients: Ingredient[]|string[];
  instructions: InstructionSection[];
  nutrition?: { [key: string]: string };
  image: string;
  collection_id?: string;
  collection?: Collection;
  source?: string;
}

export type Collection = {
  id: string;
  name: string;
}