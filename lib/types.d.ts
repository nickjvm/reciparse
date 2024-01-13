export type NextPage = {
  params: { slug: string }
  searchParams: { [key: string]: string | undefined }
}

export type Ingredient = {
  primary: string;
  subtext?: string;
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