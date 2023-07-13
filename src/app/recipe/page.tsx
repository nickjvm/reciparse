import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { decode } from 'html-entities'
import { Squares2X2Icon } from '@heroicons/react/24/outline'

import { HowToSection, Recipe } from '@/types'

import serverRequest from '@/lib/api/server'

import IngredientsList from '@/components/Ingredients'
import Time from '@/components/Time'
import SaveRecipe from '@/components/SaveRecipe'
import withHeader from '@/components/withHeader'
import RecipeError from '@/components/RecipeError'
import CookMode from '@/components/CookMode'
import Print from '@/components/Print'
import getUrl from '@/lib/api/getUrl'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: {
    url: string
  }
}
async function Page({ searchParams }: Props) {
  const recipe: Recipe = await serverRequest(`/api/recipes/parse?url=${searchParams.url}`, { method: 'POST' })

  if (recipe.error) {
    return (
      <>
        <title>Something went wrong | Reciparse</title>
        <RecipeError
          actionUrl={searchParams.url}
          errorText="We tried our best, but couldn't find a recipe to parse at the URL you entered."
          actionText="Take me to the original"
        />
      </>
    )
  } else if (recipe.recipeInstructions.length === 1 && !recipe.recipeInstructions[0].itemListElement.length) {
    return (
      <>
        <title>Something went wrong | Reciparse</title>
        <RecipeError
          errorText="We couldn&apos;t find any directions in this recipe :("
          actionText="View on the original site"
          actionUrl={searchParams.url}
        />
      </>
    )
  }

  const parseYield = (recipeYield: string | string[]): string => {
    if (Array.isArray(recipeYield)) {
      return Array.from(new Set(recipeYield.map(parseYield).filter(v => v))).join(', ')
    } else {
      const recipeYieldNum = Number(recipeYield)

      if (!isNaN(recipeYieldNum)) {
        if (recipeYieldNum > 0) {
          return `${recipeYieldNum} serving${recipeYieldNum !== 1 ? 's' : ''}`
        }
        return ''
      } else {
        return recipeYield.replace(/^0/, '').trim()
      }
    }
  }

  const renderInstructionSection = (section: HowToSection, i: number) => {
    return (
      <Fragment key={i}>
        {section.name && <h2 className="text-xl font-bold mb-2">{section.name}</h2>}
        {section.itemListElement.length === 1 && (
          <div key={i} className="mb-2 grid grid-cols-12">
            <span className="flex-grow col-span-11">
              {section.itemListElement[0].name && section.itemListElement[0].name !== section.itemListElement[0].text && <span className="block font-bold">{decode(section.itemListElement[0].name)}</span>}
              <span dangerouslySetInnerHTML={{ __html: section.itemListElement[0].text }} />
            </span>
          </div>
        )}
        {section.itemListElement.length > 1 && (
          <ol className="[counter-reset: step]">
            {section.itemListElement.map((step, i) => (
              <li key={i} className="mb-2 before:text-brand-alt grid grid-cols-12 before:content-[counter(step)] before:font-bold before:text-xl [counter-increment:step]">
                <span className="flex-grow col-span-11">
                  {step.name && step.name !== step.text && <span className="block font-bold">{decode(step.name)}</span>}
                  <span dangerouslySetInnerHTML={{ __html: step.text }} />
                </span>
              </li>
            ))}
          </ol>
        )}
      </Fragment>
    )
  }

  const schema: Partial<Recipe> = {...recipe}
  delete schema?.meta

  return (
    <>
      <title>{`${recipe.name} | Reciparse`}</title>
      <link rel="canonical" href={getUrl(`recipe?url=${searchParams.url}`)} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={recipe.name} />
      <meta property="og:url" content={getUrl(`recipe?url=${searchParams.url}`)} />
      <meta property="og:site_name" content="Reciparse" />
      <meta property="og:image" content={recipe.image} />
      <Script
        id="recipe-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({'@context':'https://schema.org','@graph':[
            schema,
            {
              '@type': 'ImageObject',
              'inLanguage': 'en-US',
              '@id': `${getUrl('recipe/#primaryimage')}`,
              'url': recipe.image,
              'contentUrl': recipe.image,
              'caption': recipe.name
            }
          ]})
        }}
      />
      <main className="print:bg-white print:min-h-0 md:p-4 md:pb-6 print:p-0">
        <div className="m-auto max-w-3xl p-4 md:p-8 print:p-0 md:rounded-md ring-brand-alt md:ring-2 print:ring-0 print:shadow-none shadow-lg bg-white">
          <div>
            <header className="grid auto-rows-auto md:grid-cols-12 print:grid-cols-12 gap-4 mb-4">
              <div className="relative w-full md:col-span-3 print:col-span-3">
                <Image className="w-full rounded aspect-square" style={{ objectFit: 'cover' }} alt={recipe.name} width={150} height={150} src={recipe.image} />
              </div>
              <div className="md:col-span-9 print:col-span-8">
                <div className="mb-4">
                  <h2 className="font-display text-brand-alt text-3xl font-bold">{recipe.name}</h2>
                  <p className="text-slate-500 text-sm print:hidden">from <Link target="_blank" href={recipe.meta.raw_source}>{recipe.meta.source}</Link></p>
                  <p className="text-slate-500 text-sm hidden print:block">{searchParams.url}</p>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <span className="inline-flex text-sm md:text-base ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded">
                    <Squares2X2Icon className="w-5"/>
                    <p className="max-w-[200px] truncate" title={parseYield(recipe.recipeYield)}>{parseYield(recipe.recipeYield)}</p>
                  </span>

                  <Time prepTime={recipe.prepTime} cookTime={recipe.cookTime} totalTime={recipe.totalTime} />
                  <SaveRecipe id={recipe.meta.id} saved={!!recipe.meta.isFavorite} />
                  <Print />
                  <CookMode />
                </div>
              </div>
            </header>
            <div className="pt-3 md:pt-0 md:grid grid-cols-8 gap-8 pb-8 sm:pb-4 md:pb-0">
              <IngredientsList ingredients={recipe.recipeIngredient} />
              <div className="col-span-8 md:col-span-5 print:col-span-5 print:mt-2">
                {recipe.recipeInstructions.map(renderInstructionSection)}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default withHeader(Page, { withSearch: true, className: 'bg-stone-100' })