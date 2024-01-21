import { InstructionSection, Recipe } from '@/lib/types'
import { WithContext, Recipe as RecipeCtx } from 'schema-dts'

type Props = {
  recipe: Recipe
}

export default function RecipeSchema({ recipe }: Props) {
  const schema: WithContext<RecipeCtx> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    'name': recipe.name,
    'prepTime': recipe.prepTime || undefined,
    'cookTime': recipe.cookTime || undefined,
    'totalTime': recipe.totalTime || undefined,
    'recipeYield': `${recipe.yield}` || undefined,
    'recipeIngredient': recipe.ingredients.map(i => i.primary),
    'recipeInstructions': recipe.instructions.map((section) => {
      const _section = section as InstructionSection
      return {
        '@type': 'HowToSection',
        'name': _section.name,
        'itemListElement': _section.steps.map(step => ({
          '@type': 'HowToStep',
          'text': step.text,
        }))
      }
    })
  }
  if (recipe.image) {
    schema.image = [recipe.image]
  }
  return (
    <script id="recipeschema" type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify(schema)
    }} />
  )
}