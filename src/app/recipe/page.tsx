import { decode } from 'html-entities'
import { Metadata } from 'next'
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types'
import { redirect } from 'next/navigation'

import { ReciparseResponse, Recipe } from '@/types'

import getUrl from '@/lib/api/getUrl'
import request from '@/lib/api'

import AppLayout from '@/components/layouts/AppLayout'
import RecipeError from '@/components/molecules/RecipeError'
import GA4Event from '@/components/atoms/GA4Event'

import View from './View'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: {
    url: string
    async: string
  }
}

async function getRecipe(url: string): Promise<ReciparseResponse> {
  return await request(`/api/recipes/parse?url=${url}`, { method: 'POST' })
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const openGraph: OpenGraph = {
    type: 'article',
    siteName: 'Reciparse',
    url: `recipe?url=${searchParams.url}`,
  }

  try {
    const { data: recipe, error}: { data: null|Recipe, error: null|Error } = await getRecipe(searchParams.url)
    if (error) {
      throw error
    } else if (recipe) {
      return {
        title: `${decode(recipe.name)} | Reciparse`,
        metadataBase: new URL(getUrl()),
        openGraph: {
          ...openGraph,
          title: decode(recipe.name),
          images: [recipe.meta.image]
        }
      }
    } else {
      throw new Error('something went wrong')
    }
  } catch (e) {
    return {
      title: 'Recipe not found | Reciparse',
      openGraph: {
        ...openGraph,
        title: 'Recipe not found',
        images: 'logo.png'
      }
    }
  }
}

export default async function Page({ searchParams }: Props) {
  const isAsync = searchParams.async === '1'
  if (searchParams.url.includes('instagram') && !isAsync) {
    return redirect(`/recipe?url=${searchParams.url}&async=1`)
  }

  if (!isAsync) {
    const { data: recipe, error}: { data: null|Recipe, error: null|Error } = await getRecipe(searchParams.url)
  
    if (error) {
      return (
        <AppLayout withSearch className="py-4">
          <title>Something went wrong | Reciparse</title>
          <GA4Event name="recipe_error" properties={{ url: searchParams.url, type: 'missing structured data' }} />
          <RecipeError
            className="max-w-xl py-8 mx-auto"
            actionUrl={searchParams.url}
            errorText="We tried our best, but couldn't find a recipe to parse at the URL you entered."
            actionText="View on the original site"
            type="parse_error"
            url={searchParams.url}
            details={error}
          />
        </AppLayout>
      )
    } else if (recipe) {
      if (recipe.recipeInstructions.length === 1 && !recipe.recipeInstructions[0].itemListElement.length) {
        return (
          <AppLayout withSearch className="py-4">
            <title>Something went wrong | Reciparse</title>
            <GA4Event name="recipe_error" properties={{ url: searchParams.url, type: 'missing instructions' }} />
            <RecipeError
              className="max-w-xl py-8 mx-auto"
              errorText="We couldn&apos;t find any directions in this recipe :("
              actionText="View on the original site"
              actionUrl={searchParams.url}
              type="parse_error"
              url={searchParams.url}
              details={{
                message: 'missing instructions'
              }}
            />
          </AppLayout>
        )
      }
  
      const schema: Partial<Recipe> = {...recipe}
      delete schema?.meta
  
      return (
        <>
          <AppLayout withSearch className="py-4 bg-gray-50" fullWidth>
            <GA4Event name="view_recipe" properties={{ url: searchParams.url }} />
            <link rel="canonical" href={getUrl(`recipe?url=${searchParams.url}`)} />
            <script
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
            <View recipe={recipe} />
          </AppLayout>
        </>
      )
    }
  
    return null
  } else {
    return (
      <AppLayout withSearch className="py-4 bg-gray-50 flex" fullWidth>
        <View recipe={null} isAsync />
      </AppLayout>
    )
  }
}
