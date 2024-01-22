'use client'
import LogRocket from 'logrocket'
import { getNutrition } from '@/app/parse/actions'
import { Ingredient, Nutrition } from '@/lib/types'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import getUrl from '@/lib/getUrl'
import { usePathname, useSearchParams } from 'next/navigation'

interface Props {
  data?: Nutrition|null
  ingredients: Ingredient[]
  recipeYield?: string
  source?: string
}

const renderNutritionValue = (value: string) => {
  return value.replace('milli', 'm').replace(/grams?/, 'g')
}

export default function NutritionInfo({ data: _data, ingredients, source }: Props) {
  const [data, setData] = useState<Nutrition|null|undefined>(_data)
  const [isPending, startTransition] = useTransition()
  const [showEdamam, setShowEdamam] = useState(false)
  const [error, setError] = useState(false)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const loadNutritionInfo = () => {
    startTransition(async () => {
      try {
        const response = await getNutrition(ingredients.map(ing => ing.primary))
        setData(response)
        setShowEdamam(true)
      } catch (error) {
        LogRocket.captureException(error as Error, {
          extra: {
            service: 'Edamam',
            pageName: document.title,
            url: getUrl(`${pathname}?${searchParams}`),
          },
        })

        console.log(error)
        setError(true)
      }
    })
  }

  const note = <div className="text-xs mb-3">Note: The information shown below is {showEdamam ? 'Edamam\'s' : 'an'} estimate based on available ingredients and preparation. It should not be considered a substitute for a professional advice.</div>

  if (!data) {
    return (
      <div className="print:hidden">
        <h2 className="text-xl font-semibold mb-2">Nutrition</h2>
        {!isPending && !error && <form action={loadNutritionInfo}><button className="text-sm underline" onClick={loadNutritionInfo}>Show nutrition information</button></form>}
        {!isPending && error && <div>Could not load nutrition information.</div>}
        {isPending && (
          <>
            {note}
            <div className="grid grid-cols-12 animate-pulse">
              <div className="col-span-12 sm:col-span-6">
                <div className="h-3 bg-gray-200 rounded-full w-[60%] min-w-24 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-full w-[70%] min-w-24  mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-full w-[50%] min-w-24  mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-full w-[75%] min-w-24  mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-full w-[80%] min-w-24  mb-3"></div>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <div className="h-3 bg-gray-200 rounded-full w-[60%] min-w-24 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-full w-[70%] min-w-24  mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-full w-[50%] min-w-24  mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-full w-[75%] min-w-24  mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-full w-[80%] min-w-24  mb-3"></div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Nutrition</h2>
      {note}
      <h3 className="text-md font-bold mb-2">
        {data.calories && <span className="font-bold">
          {typeof data.calories === 'number' && `${data.calories} kcal`}
          {typeof data.calories === 'string' && (data.calories.includes('cal') ? data.calories : `${data.calories} kcal`)}
        </span>}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {data.fatContent && <div className="text-sm">
          <span className="font-medium">Total fat: </span>
          {renderNutritionValue(data.fatContent)}
        </div>}
        {data.saturatedFatContent && <div className="text-sm">
          <span className="font-medium">Saturated fat: </span>
          {renderNutritionValue(data.saturatedFatContent)}
        </div>}
        {data.unsaturatedFatContent && <div className="text-sm">
          <span className="font-medium">Unsaturated fat: </span>
          {renderNutritionValue(data.unsaturatedFatContent)}
        </div>}
        {data.transFatContent && <div className="text-sm">
          <span className="font-medium">Trans fat: </span>
          {renderNutritionValue(data.transFatContent)}
        </div>}
        {data.sodiumContent && <div className="text-sm">
          <span className="font-medium">Sodium: </span>
          {renderNutritionValue(data.sodiumContent)}
        </div>}
        {data.carbohydrateContent && <div className="text-sm">
          <span className="font-medium">Total carbs: </span>
          {renderNutritionValue(data.carbohydrateContent)}
        </div>}
        {data.fiberContent && <div className="text-sm">
          <span className="font-medium">Fiber: </span>
          {renderNutritionValue(data.fiberContent)}
        </div>}
        {data.sugarContent && <div className="text-sm">
          <span className="font-medium">Sugar: </span>
          {renderNutritionValue(data.sugarContent)}
        </div>}
        {data.proteinContent && <div className="text-sm">
          <span className="font-medium">Protein: </span>
          {renderNutritionValue(data.proteinContent)}
        </div>}
      </div>
      {showEdamam && <Image width="192" height="38" className="w-48 mt-2 -ml-2" src="/edamam-badge.svg" alt="Powered by Edamam" />}
      {!showEdamam && source && <div className="mt-2 text-sm">Provided by {source}</div>}
    </div>
  )
}