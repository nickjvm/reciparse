import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

interface Recipe {
  id: string
  title: string
  image: string
  slug: string
}
export default async function Home() {
  const data: Recipe[] = await fetch('http://localhost:3000/api/recipes').then(r => r.json())

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        {data.map((recipe: Recipe) => (
          <div key={recipe.id}>
            <Image alt={recipe.title} width={300} height={300} src={recipe.image} />
            <Link href={`/recipe/${recipe.slug}`}>{recipe.title}</Link>
          </div>
        ))}
      </div>
    </main>
  )
}
