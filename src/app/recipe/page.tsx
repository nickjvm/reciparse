import { Fragment } from 'react'
import Image from 'next/image'
import styles from './page.module.scss'
import Link from 'next/link'
import { decode } from 'html-entities';
import IngredientsList from '@/components/Ingredients';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import Time from '@/components/Time';
import { HowToSection, Recipe, RecipeInstruction } from '@/types';


interface Props {
  params: { slug: string };
  searchParams: {
    url: string | undefined
  }
}

export default async function Page({ searchParams }: Props) {
  const recipe: Recipe = await fetch(`http://localhost:8080/recipes/parse?url=${searchParams.url}`, { method: 'POST' }).then(r => r.json())

  const instructions = recipe.recipeInstructions.reduce((acc: HowToSection[], instruction: RecipeInstruction) => {
    if (typeof instruction === 'string') {
      acc[0].itemListElement.push({
        '@type': 'HowToStep',
        text: instruction
      })
    } else {
      if (instruction['@type'] === 'HowToStep') {
        acc[0].itemListElement.push(instruction)
      } else if (instruction['@type'] === 'HowToSection') {
        acc.push(instruction)
      }
    }
    return acc
  }, [{
    name: '',
    '@type': 'HowToSection',
    itemListElement: []
  }])
    .flat()

  const parseYield = (recipeYield: string | string[]): string => {
    if (Array.isArray(recipeYield)) {
      return Array.from(new Set(recipeYield.map(parseYield))).join(', ')
    } else {
      const recipeYieldNum = Number(recipeYield)
      if (recipeYieldNum) {
        return `${recipeYieldNum} serving${recipeYieldNum !== 1 ? 's' : ''}`
      } else {
        return recipeYield
      }
    }
  }

  const renderInstructionSection = (section: HowToSection, i: number, instructions: HowToSection[]) => {
    if (instructions.length === 1 && !section.itemListElement.length) {
      return (
        <>
          <p className="mb-4">We couldn&apos;t find any directions in this recipe :(</p>
          <p>Try viewing the recipe at the source: <Link className="text-blue-500 underline" href={recipe.meta.raw_source} target="_blank">{recipe.meta.raw_source}</Link></p>
        </>
      )
    }
    return (
      <Fragment key={i}>
        {section.name && <h2 className="text-lg font-bold mb-2">{section.name}</h2>}
        <ol className={styles.instructions}>
          {section.itemListElement.map((step, i) => (
            <li key={i} className="mb-2 before:text-brand-alt grid grid-cols-12">

              <span className="flex-grow col-span-11">
                {step.name && step.name !== step.text && <span className="font-bold">{step.name}: </span>}
                {decode(step.text || step as unknown as string)}
              </span>
            </li>
          ))}
        </ol>
      </Fragment>
    )
  }

  let image
  if (typeof recipe.image[0] === 'string') {
    image = recipe.image[0]
  } else {
    image = recipe.image[0].url
  }
  return (
    <main className="bg-stone-100 print:bg-white md:min-h-screen print:min-h-0 md:p-4 print:p-0">
      <div className="m-auto max-w-3xl p-4 md:p-8 print:p-0 md:rounded-md ring-brand-alt md:ring-2 print:ring-0 print:shadow-none shadow-lg bg-white">
        <div>
          <header className="grid auto-rows-auto md:grid-cols-12 print:grid-cols-12 gap-4 mb-4">
            <Image className="w-full md:col-span-3 print:col-span-3 rounded aspect-square" style={{ objectFit: 'cover' }} alt={recipe.name} width={150} height={150} src={image} />
            <div className="md:col-span-9 print:col-span-8">
              <div className="mb-4">
                <h2 className="font-display text-brand-alt text-3xl font-bold">{recipe.name}</h2>
                <p className="text-slate-500 text-sm">from <Link target="_blank" href={recipe.meta.raw_source}>{recipe.meta.source}</Link></p>
              </div>
              <div className="flex gap-4">
                <span className="inline-flex ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded">
                  <Squares2X2Icon className="w-5"/>
                  <h4>{parseYield(recipe.recipeYield)}</h4>
                </span>

                <Time prepTime={recipe.prepTime} cookTime={recipe.cookTime} totalTime={recipe.totalTime} />
              </div>
            </div>
          </header>
          <div className="grid grid-cols-8 gap-8 pb-8 sm:pb-4 md:pb-0">
            <IngredientsList ingredients={recipe.recipeIngredient} />
            <div className="col-span-8 md:col-span-5 print:col-span-5">
              <h3 className="text-xl font-bold mb-2">Directions</h3>
              {instructions.map(renderInstructionSection)}
            </div>
          </div>
          {recipe.notes && (
            <div className={styles.notes}>
              <h3>Notes</h3>
              <p>{recipe.notes}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
