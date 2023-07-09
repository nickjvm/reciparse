import Header from "@/components/Header"
import QuickSearch from "@/components/QuickSearch"
import request, { serverRequest } from "@/lib/api"
import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"

interface RecentRecipe {
  id: number,
  name: string,
  url: string,
  image_url: string,
}
export default async function Page() {
  const recent: RecentRecipe[] = await serverRequest('/api/recipes/recent')

  return (
    <div className="flex flex-col h-screen">
      <Header withBorder withSearch={false} />
      <div className="grow flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-xl items-center justify-between p-4 print:px-0 md:px-6 gap-2">
          <p className="text-center text-lg mb-5">Ditch the endless scrolling, endless stories, ads and videos. Get exactly what you need: <em className="text-brand-alt">the recipe.</em></p>
          <QuickSearch size="lg" inputClassName="hover:ring-brand ring-2" autoFocus />
        </div>
        <div className="w-full mt-6">
          <h2 className="font-display text-center text-2xl font-bold text-brand-alt">Recent Recipes</h2>
          <div className="w-full p-4 flex justify-center flex-wrap md:flex-nowrap align-stretch">
            {recent.map((recipe: RecentRecipe, i) => (
              <div key={recipe.id} className={classNames('px-4 shrink-0 grow-0 md:w-1/5 w-1/2 mb-4 md:mb-0 self-stretch', i === recent.length - 1 && 'md:hidden')}>
                <Link href={`/recipe/?url=${recipe.url}`} className="hover:relative md:hover:ring-brand transition ring-2 ring-transparent rounded block p-3 -mx-3 h-full">
                  <Image alt={recipe.name} src={recipe.image_url} width="100" height="100" className="w-full rounded aspect-square mb-3" style={{ objectFit: 'cover' }} />
                  <p className="text-sm line-clamp-2">{recipe.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}