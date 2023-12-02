'use client'
import { useAuthContext } from '@/context/AuthContext'
import request from '@/lib/api'
import { EdamamResponse, Nutrition } from '@/types'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  data?: Nutrition|null
  ingredientsList: string[]
  recipeYield?: string | string[]
  source?: string
}

const renderNutritionValue = (value: string) => {
  return value.replace('milli', 'm').replace(/grams?/, 'g')
}

const getServingSize = (recipeYield: number|string|string[]|null): number|null => {
  if (!recipeYield) {
    return null
  }
  if (typeof recipeYield === 'string') {
    const servingsMatch = recipeYield.match(/[1-9][0-9]*/)
    if (servingsMatch) {
      return parseInt(servingsMatch[0], 10) || 1
    }
    return null
  } else if (typeof recipeYield === 'number') {
    return recipeYield
  }

  return getServingSize(recipeYield.find((y) => y.match(/[1-9]+/)) || '1')
}

export default function NutritionInfo({ data: _data, ingredientsList, recipeYield = '1', source }: Props) {
  const { user } = useAuthContext()
  const [data, setData] = useState<Nutrition|undefined|null>(_data)
  const [loading, setLoading] = useState(false)
  const [servings, setServings] = useState(getServingSize(recipeYield))
  const [showEdamam, setShowEdamam] = useState(false)
  const [error, setError] = useState(false)

  const loadNutritionInfo = async () => {
    try {
      setLoading(true)
      const { data, error } = await request('/api/recipes/nutrition', {
        method: 'POST',
        body: JSON.stringify({
          ingredientsList,
          recipeYield: getServingSize(recipeYield)
        })
      })

      if (error) {
        throw error
      }

      const { nutrition, servings }: EdamamResponse = data

      setShowEdamam(true)
      if (!servings) {
        setServings(servings)
      }
      setData(nutrition)
    } catch (e) {
      setError(true)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const note = <div className="text-xs mb-3">Note: The information shown below is {showEdamam ? 'Edamam\'s' : 'an'} estimate based on available ingredients and preparation. It should not be considered a substitute for a professional advice.</div>

  if (!data && user) {
    return (
      <div className="print:hidden">
        <h2 className="text-xl font-bold mb-2">Nutrition</h2>
        {!loading && !error && <button className="text-sm underline" onClick={loadNutritionInfo}>Show nutrition information</button>}
        {!loading && error && <div>Could not load nutrition information.</div>}
        {loading && (
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
    <>
      <h2 className="text-xl font-bold mb-2">Nutrition {data && servings && servings > 1 && `(${servings} servings)`}</h2>
      {note}
      <h3 className="text-md font-bold mb-2">
        {servings && servings > 1 && 'Per serving: '}
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
      {showEdamam && <Image width="100" height="100" className="w-48 mt-2 -ml-2" src="/edamam-badge.svg" alt="Powered by Edamam" />}
      {!showEdamam && source && <div className="mt-2 text-sm">Provided by {source}</div>}
    </>
  )
}