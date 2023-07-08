import styles from './page.module.scss'
import Link from 'next/link'
import { Recipe, RecipeInstruction } from '@/types';

interface IPageProps {
  params: { slug: string };
}
export default async function Page({ params }: IPageProps) {
  const recipe: Recipe = await fetch(`http://localhost:3000/api/recipes/${params.slug}`).then(r => r.json())

  const nutrition = await fetch(`https://api.edamam.com/api/nutrition-details?app_id=47379841&app_key=${process.env.EDAMAM_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingr: recipe.recipeIngredient })
  }).then(r => r.json())

  console.log(nutrition)
  return (
    <main className={styles.main}>
      <Link href="/">Go Back</Link>
      <div className={styles.description}>
        <div className={styles.recipe} key={recipe.id}>
          <header className={styles.header}>
            <div className={styles.title}>
              <h2>{recipe.name}</h2>
              <div className={styles.times}>
                <div>
                  <div>Prep Time</div>
                  <div>15 mins</div>
                </div>
                <div>
                  <div>Cook Time</div>
                  <div>15 mins</div>
                </div>
                <div>
                  <div>Total Time</div>
                  <div>15 mins</div>
                </div>
              </div>
            </div>
          </header>
          <div className="fixed md:static">
            <h3>Ingredients</h3>
            <ul>
              {recipe.recipeIngredient.map((ingredient: string, i: number)=> (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <h3>Directions</h3>
          <ol>
            {recipe.recipeInstructions.map((step: RecipeInstruction, i: number) => {
              if (step['@type'] === 'HowToStep') {
                return <li key={i}>{step.text}</li>
              } else {
                return null
              }
            })}
          </ol>
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
