import Card from '@/components/ui/atoms/Card'
import QuickSearch from '@/components/ui/molecules/QuickSearch'
import RecentlyViewedCarousel from '@/components/ui/molecules/RecentlyViewedCarousel'
import ContentContainer from '@/components/ui/templates/ContentContainer'
import readUserSession from '@/lib/actions'
import createSupabaseServerClient from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createSupabaseServerClient()

  const { data } = await readUserSession()

  const { data: parsedRecipes } = await supabase.from('random_parsed').select().limit(8)

  let savedRecipes
  let viewHistory
  if (data?.session) {
    ({ data: savedRecipes } = await supabase.from('random_recipes').select('*, collections(*)').limit(8));
    ({ data: viewHistory } = await supabase.from('history').select('*, recipes(*, collections(name)), parsed(*)').order('updated_at', { ascending: false }).limit(16))
  }

  return (
    <ContentContainer fullWidth>
      <div className="items-center justify-between p-4 print:px-0 gap-2 bg-gradient-to-br from-brand-alt to-35% to-primary mb-4 -mt-4 -mx-4 lg:mx-auto">
        <div className="w-full max-w-5xl mx-auto py-12 md:py-24 md:px-6">
          <h1 className="text-2xl md:text-5xl font-display text-white max-w-2xl">
              Ditch the endless scrolling, stories, ads and videos. Get exactly what you need:
            <em className="block italic">the recipe.</em>
          </h1>
          <div className="max-w-xl mt-8">
            <QuickSearch size="lg" autoFocus placeholder="Paste a recipe URL" />
          </div>
        </div>
      </div>
      <div className="m-auto max-w-screen-2xl">
        <div className="space-y-3 divide-y divide-slate-200">
          <RecentlyViewedCarousel history={viewHistory} />
          <div className="pt-5">
            <h3 className="font-display text-primary text-xl lg:text-3xl text-center">Discover new recipes</h3>
            <div className="flex overflow-auto p-3">
              {parsedRecipes?.map(recipe => {
                const subtitle = recipe.url ? new URL(recipe.url).hostname : undefined
                return (
                  <div key={recipe.id} className="px-1.5 flex min-w-[36vw] w-[36vw] lg:w-[15vw] lg:min-w-[15vw] xl:min-w-1/8 xl:w-1/8">
                    <Card
                      key={recipe.id}
                      image={recipe.image}
                      url={`/parse?url=${recipe.url}`}
                      title={recipe.name || ''}
                      subtitle={subtitle?.replace('www.', '')}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          {savedRecipes && (
            <div className="pt-5">
              <h3 className="font-display text-primary text-xl lg:text-3xl text-center">Saved to your collections</h3>
              <div className="flex overflow-auto p-3">
                {savedRecipes?.map(recipe => {
                  return (
                    <div key={recipe.id} className="px-1.5 flex min-w-[36vw] w-[36vw] lg:w-[15vw] lg:min-w-[15vw] xl:min-w-1/8 xl:w-1/8">
                      <Card
                        key={recipe.id}
                        image={recipe.image}
                        url={`/recipes/${recipe.id}`}
                        title={recipe.name || ''}
                        subtitle={recipe.collections?.name}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ContentContainer>
  )
}
