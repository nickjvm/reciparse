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
      <meta property="og:type" content="article" />
      <meta property="og:title" content="Amazing Vegetable Pizza - WP Recipe Maker Demo" />
      <Script
        id="recipe-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'WebPage','@id':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/','url':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/','name':'Amazing Vegetable Pizza - WP Recipe Maker Demo','isPartOf':{'@id':'https://demo.wprecipemaker.com/#website'},'primaryImageOfPage':{'@id':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#primaryimage'},'image':{'@id':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#primaryimage'},'thumbnailUrl':'https://demo.wprecipemaker.com/wp-content/uploads/2018/10/baked-beer-cheese-724216.jpg','datePublished':'2018-10-29T15:34:52+00:00','dateModified':'2022-07-14T14:05:39+00:00','author':{'@id':'https://demo.wprecipemaker.com/#/schema/person/667283f6a734dd0b1facfd717e1494a2'},'breadcrumb':{'@id':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#breadcrumb'},'inLanguage':'en-US','potentialAction':[{'@type':'ReadAction','target':['https://demo.wprecipemaker.com/amazing-vegetable-pizza/']}]},{'@type':'ImageObject','inLanguage':'en-US','@id':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#primaryimage','url':'https://demo.wprecipemaker.com/wp-content/uploads/2018/10/baked-beer-cheese-724216.jpg','contentUrl':'https://demo.wprecipemaker.com/wp-content/uploads/2018/10/baked-beer-cheese-724216.jpg','width':2560,'height':1707,'caption':'A vegetable pizza'},{'@type':'BreadcrumbList','@id':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#breadcrumb','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':'https://demo.wprecipemaker.com/'},{'@type':'ListItem','position':2,'name':'Amazing Vegetable Pizza'}]},{'@type':'WebSite','@id':'https://demo.wprecipemaker.com/#website','url':'https://demo.wprecipemaker.com/','name':'WP Recipe Maker Demo','description':'Demo site for the WPRM recipe plugin','potentialAction':[{'@type':'SearchAction','target':{'@type':'EntryPoint','urlTemplate':'https://demo.wprecipemaker.com/?s={search_term_string}'},'query-input':'required name=search_term_string'}],'inLanguage':'en-US'},{'@type':'Person','@id':'https://demo.wprecipemaker.com/#/schema/person/667283f6a734dd0b1facfd717e1494a2','name':'Brecht','image':{'@type':'ImageObject','inLanguage':'en-US','@id':'https://demo.wprecipemaker.com/#/schema/person/image/','url':'https://secure.gravatar.com/avatar/937a508bfc4e251327ab85d0d1b7ab2c?s=96&d=mm&r=g','contentUrl':'https://secure.gravatar.com/avatar/937a508bfc4e251327ab85d0d1b7ab2c?s=96&d=mm&r=g','caption':'Brecht'},'sameAs':['http://wprecipemaker.wpengine.com'],'url':'https://demo.wprecipemaker.com/author/wprecipemaker/'},{'@type':'Recipe','name':'Amazing Vegetable Pizza','author':{'@id':'https://demo.wprecipemaker.com/#/schema/person/667283f6a734dd0b1facfd717e1494a2'},'description':'Every night can be pizza night, if you ask me. Just throw whatever vegetable leftovers you have on there and enjoy!','datePublished':'2018-10-29T16:34:52+00:00','image':['https://demo.wprecipemaker.com/wp-content/uploads/2018/10/baked-beer-cheese-724216.jpg','https://demo.wprecipemaker.com/wp-content/uploads/2018/10/baked-beer-cheese-724216-500x500.jpg','https://demo.wprecipemaker.com/wp-content/uploads/2018/10/baked-beer-cheese-724216-500x375.jpg','https://demo.wprecipemaker.com/wp-content/uploads/2018/10/baked-beer-cheese-724216-480x270.jpg'],'recipeYield':['2','2 pizzas'],'prepTime':'PT15M','cookTime':'PT15M','totalTime':'PT60M','recipeIngredient':['1 cup water (lukewarm)','2 cups all-purpose flour','1 tsp instant yeast','1 tsp salt','1 tsp sugar','red sauce','1/4  red onion','1/4  green pepper','1/4  red pepper','rosemary'],'recipeInstructions':[{'@type':'HowToStep','text':'Combine the water, yeast and sugar in a bowl. Rest for 5 minutes.','name':'Combine','url':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#wprm-recipe-41-step-0-0'},{'@type':'HowToStep','text':'Combine the flour and salt.','name':'Combine','url':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#wprm-recipe-41-step-0-1'},{'@type':'HowToStep','text':'Add the yeast mixture and knead until you get a soft ball.','name':'Knead','url':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#wprm-recipe-41-step-0-2'},{'@type':'HowToStep','text':'Place in a bowl and cover. Let rise for 30 minutes.','name':'Rise','url':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#wprm-recipe-41-step-0-3'},{'@type':'HowToStep','text':'Pre-heat the oven to 400 °F or 450 °F.','name':'Pre-heat the oven to 400 °F or 450 °F.','url':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#wprm-recipe-41-step-0-4'},{'@type':'HowToStep','text':'Divide the dough and form pizzas.','name':'Form Pizzas','url':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#wprm-recipe-41-step-0-5','image':'https://demo.wprecipemaker.com/wp-content/uploads/2018/10/bake-baker-bakery-1251179.jpg'},{'@type':'HowToStep','text':'Top the pizzas with sauce and vegetables, cook for 15 minutes on the pizza stone.','name':'Cook','url':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#wprm-recipe-41-step-0-6'}],'aggregateRating':{'@type':'AggregateRating','ratingValue':'4.52','ratingCount':'1138'},'recipeCategory':['Pizza'],'recipeCuisine':['Italian'],'keywords':'Vegetarian','nutrition':{'@type':'NutritionInformation','calories':'482 kcal','carbohydrateContent':'101 g','proteinContent':'14 g','fatContent':'1 g','sodiumContent':'1174 mg','fiberContent':'4 g','sugarContent':'4 g','servingSize':'1 serving'},'@id':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/#recipe','isPartOf':{'@id':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/'},'mainEntityOfPage':'https://demo.wprecipemaker.com/amazing-vegetable-pizza/'}]})
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