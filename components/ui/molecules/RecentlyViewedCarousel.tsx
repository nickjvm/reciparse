'use client'

import { Database } from '@/lib/supabase/types/supabase'
import Card from '../atoms/Card'
import { LocalSearchHistory } from '@/lib/types'
import { useEffect, useState } from 'react'

type Props = {
  history?: (
    Database['public']['Tables']['history']['Row'] & {
      recipes: {
        id: string
        image: string|null
        name: string
        source: string|null
        collections: {
          name: string
        }|null
      }|null
      parsed: {
        id: string
        image: string|null
        name: string
        url: string
      }|null
    }
  )[]|null
}

export default function RecentlyViewedCarousel({ history: serverHistory }: Props) {
  const [history, setHistory] = useState<Props['history']>(serverHistory)

  useEffect(() => {
    if (!serverHistory?.length) {
      const history = JSON.parse(global?.window?.localStorage.getItem('search_history') || '[]').map((item: LocalSearchHistory, i: number) => ({
        id: i,
        recipes: null,
        parsed_id: item.id,
        parsed: {
          name: item.name,
          url: item.url,
          image: item.image_url,
        }
      }))
      setHistory(history)
    }
  }, [])

  if (history?.length) {
    return (
      <div className="pt-5">
        <h3 className="font-display text-primary text-xl lg:text-3xl text-center">Pick up where you left off</h3>
        <div className="flex overflow-auto p-3">
          {
            history.filter((item, _, items) => {
              if (item.parsed_id) {
                return !items.find(i => item.parsed?.url === i.recipes?.source)
              }
              return !!item.recipe_id
            }).map((history, i) => {
              if (i > 7) {
                return null
              }
              const subtitle = history.parsed?.url ? new URL(history.parsed.url).hostname : `Saved to ${history.recipes?.collections?.name}`
              return (
                <div key={history.id} className="px-1.5 flex min-w-[36vw] w-[36vw] lg:w-[15vw] lg:min-w-[15vw] xl:min-w-1/8 xl:w-1/8">
                  <Card
                    image={history.recipes?.image || history.parsed?.image}
                    url={history.recipes ? `/recipes/${history.recipes.id}` : `/parse?url=${history.parsed?.url}`}
                    title={history.recipes?.name || history.parsed?.name || ''}
                    subtitle={subtitle}
                  />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}