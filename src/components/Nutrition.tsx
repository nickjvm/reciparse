'use client'
import clientRequest from '@/lib/api/client'
import { EdamamResponse, Nutrition } from '@/types'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  data?: Nutrition|null
  ingredientsList: string[]
  recipeYield: string | string[]
  source?: string
}

const renderNutritionValue = (value: string) => {
  return value.replace('milli', 'm').replace(/grams?/, 'g')
}

const getServingSize = (recipeYield: string|string[]): number|null => {
  if (typeof recipeYield === 'string') {
    const servingsMatch = recipeYield.match(/\d+/)
    if (servingsMatch) {
      return parseInt(servingsMatch[0], 10) || 1
    }
    return null
  }

  return getServingSize(recipeYield.find((y) => y.match(/\d+/)) || '1')
}

export default function NutritionInfo({ data: _data, ingredientsList, recipeYield, source }: Props) {
  const [data, setData] = useState<Nutrition|undefined|null>(_data)
  const [loading, setLoading] = useState(false)
  const [servings, setServings] = useState(getServingSize(recipeYield))
  const [showEdamam, setShowEdamam] = useState(false)
  const [error, setError] = useState(false)

  const loadNutritionInfo = async () => {
    try {
      setLoading(true)
      const { nutrition, servings, error }: EdamamResponse = await clientRequest('/api/recipes/nutrition', {
        method: 'POST',
        body: JSON.stringify({
          ingredientsList,
          recipeYield: getServingSize(recipeYield)
        })
      })

      if (error) {
        throw error
      }

      setShowEdamam(true)
      setServings(servings)
      setData(nutrition)
    } catch (e) {
      setError(true)
      setData(null)
    } finally {
      setLoading(false)
    }
  }


  const note = <div className="text-xs mb-3">Note: The information shown below is {showEdamam ? 'Edamam\'s' : 'an'} estimate based on available ingredients and preparation. It should not be considered a substitute for a professional advice.</div>

  if (!data) {
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

  return (
    <>
      <h2 className="text-xl font-bold mb-2">Nutrition {data && `(${servings} serving${servings !== 1 && 's'})`}</h2>
      {note}
      <div className="grid grid-cols-12">
        <div className="col-span-12 sm:col-span-6 print:col-span-6">
          {data.calories && <div className="font-bold">{data.calories} calories</div>}
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
        </div>
        <div className="col-span-12 col-span-6 print:col-span-6">
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
      </div>
      {showEdamam && <Image width="100" height="100" className="w-48 mt-2 -ml-2" src="/edamam-badge.svg" alt="Powered by Edamam" />}
      {!showEdamam && source && <div className="mt-2 text-sm">Provided by {source}</div>}
    </>
  )
}