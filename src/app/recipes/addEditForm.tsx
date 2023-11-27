'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { parse, Duration } from 'iso8601-duration'
import Image from 'next/image'
import Textarea from '@/components/atoms/Textarea'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import Button from '@/components/atoms/Button'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import request from '@/lib/api'
import { Recipe } from '@/types'
import useAutosizeTextArea from '@/hooks/useAutosizeTextarea'
import PlaceholderImage from '@/components/atoms/PlaceholderImage'

export type FormValues = {
  id?: number
  handle?: string
  name: string
  recipeInstructions: {
    text: string
  }[],
  file?: File
  image: string
  recipeYield: string|string[]
  prepTime: Duration
  cookTime: Duration
  recipeIngredient: string
}

type Props = {
  onSubmit: (values: FormValues) => void
  onLoad?: (values: Recipe) => void
}

export default function AddEditForm({ onSubmit, onLoad }: Props) {
  const { handle } = useParams()
  const router = useRouter()
  const { register, reset, control, watch, handleSubmit, setFocus, setValue, unregister } = useForm<FormValues>({
    defaultValues: {
      name: '',
      recipeYield: '4',
      recipeInstructions: [{ text: ''}],
      prepTime: {
        hours: 0,
        minutes: 0,
      },
      cookTime: {
        hours: 0,
        minutes: 0,
      },
      image: '',
      recipeIngredient: '',
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'recipeInstructions',
  })

  const recipe = watch()
  useEffect(() => {
    if (!handle || handle === recipe.handle) {
      return
    }

    request(`/api/recipes/custom/${handle}`).then(({ data }: { data: null|Recipe, error: null|Error}) => {
      if (data) {
        const { name, prepTime = '', cookTime = '', recipeYield = '0', id, image } = data
        let finalPrepTime
        let finalCookTime
        try {
          finalPrepTime = parse(prepTime)
          finalCookTime = parse(cookTime)
        } catch (e) {
          finalPrepTime = parse('PT0M')
          finalCookTime = parse('PT0M')
        }

        if (finalPrepTime.minutes ?? 0 >= 60) {
          const additionalHours = Math.floor((finalPrepTime.minutes ?? 0) / 60)
          console.log(finalPrepTime.minutes, additionalHours)
          finalPrepTime.hours = (finalPrepTime.hours ?? 0) + additionalHours
          finalPrepTime.minutes = (finalPrepTime.minutes ?? 0) - (additionalHours * 60)
        }
        if (finalCookTime.minutes ?? 0 >= 60) {
          const additionalHours = Math.floor((finalCookTime.minutes ?? 0) / 60)
          finalCookTime.hours = (finalCookTime.hours ?? 0) + additionalHours
          finalCookTime.minutes = (finalCookTime.minutes ?? 0) - (additionalHours * 60)

        }
        const defaultValues: FormValues = {
          id,
          name,
          image,
          recipeIngredient: data.recipeIngredient.join('\n'),
          recipeInstructions: data.recipeInstructions[0].itemListElement.map(item => ({ text: item.text })),
          prepTime: finalPrepTime,
          cookTime: finalCookTime,
          recipeYield,
        }
        reset(defaultValues || {})
        if (onLoad) {
          onLoad(data)
        }
      }
    })
  }, [handle])

  const onDelete = async () => {
    await request('/api/recipes/custom/' + handle, {
      method: 'DELETE',
    })

    router.push('/recipes')
  }

  const ingredientsRef = useRef<HTMLTextAreaElement>(null)

  useAutosizeTextArea(ingredientsRef.current, recipe.recipeIngredient)

  if (handle && !recipe.id) {
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue('image', URL.createObjectURL(e.target.files[0]))
      setValue('file', e.target.files[0])
    } else {
      setValue('image', '')
      unregister('file')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <header className="grid auto-rows-auto md:grid-cols-12 print:grid-cols-12 gap-4 mb-4">
        <div className="relative w-full md:col-span-3 print:col-span-3">
          <label htmlFor="uploadImage" className="cursor-pointer">
            {recipe.image && <Image className="w-full rounded aspect-square" style={{ objectFit: 'cover' }} alt={recipe.name} width={150} height={150} src={recipe.image} />}
            {!recipe.image && <PlaceholderImage />}
            <span className="sr-only">Click to upload an image</span>
            <input type="file" className="invisible absolute" id="uploadImage" onChange={handleFileChange} />
          </label>
        </div>
        <div className="md:col-span-9 print:col-span-8">
          <div className="mb-4">
            <input {...register('name')} autoFocus placeholder="Recipe Title" className="placeholder:text-gray-300 w-full rounded-md border-gray-200 font-display text-brand-alt text-3xl font-bold" />
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="">
              <label htmlFor="recipeYield" className="text-xs mb-2 text-slate-500">Recipe Yield</label>
              <div className="flex rounded-md ring-1 ring-inset ring-gray-300 items-center">
                <input {...register('recipeYield')} type="text" name="recipeYield" id="price" className="rounded-md block w-12 text-center border-0 py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent" />
                <div className=" inset-y-0 right-0 flex items-center h-full rounded-md border-0 bg-transparent py-0 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                  servings
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <label htmlFor="preptime" className="text-xs mb-2 text-slate-500">Prep Time</label>
                <div className="flex rounded-md ring-1 ring-inset ring-gray-300 items-center">
                  <input {...register('prepTime.hours')} type="text" className="text-center block w-12 rounded-md border-0 py-1.5 px-4 text-gray-900 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  <div className="inset-y-0 right-0 flex items-center h-full rounded-md border-0 bg-transparent py-0 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                    hours
                  </div>
                </div>
              </div>
              <div>
                <div className="flex rounded-md ring-1 ring-inset ring-gray-300 items-center">
                  <input {...register('prepTime.minutes')} className="text-center block w-12 rounded-md border-0 py-1.5 px-4 text-gray-900 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  <div className="inset-y-0 right-0 flex items-center h-full rounded-md border-0 bg-transparent py-0 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                    minutes
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <label htmlFor="cooktime" className="text-xs mb-2 text-slate-500">Cook Time</label>
                <div className="flex rounded-md ring-1 ring-inset ring-gray-300 items-center">
                  <input {...register('cookTime.hours')} className="text-center block w-12 rounded-md border-0 py-1.5 px-4 text-gray-900 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  <div className="inset-y-0 right-0 flex items-center">
                    <div className="inset-y-0 right-0 flex items-center h-full rounded-md border-0 bg-transparent py-0 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                      hours
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex rounded-md ring-1 ring-inset ring-gray-300 items-center">
                  <input {...register('cookTime.minutes')} className="text-center block w-12 rounded-md border-0 py-1.5 px-4 text-gray-900 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  <div className="inset-y-0 right-0 flex items-center">
                    <div className="inset-y-0 right-0 flex items-center h-full rounded-md border-0 bg-transparent py-0 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                      minutes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="pt-3 md:pt-0 md:grid grid-cols-8 gap-8 pb-8 sm:pb-4 md:pb-0">
        <div className="col-span-8 md:col-span-3 print:col-span-3 mb-3 md:mb-0">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            Ingredients
          </h3>
          <p className="text-slate-500 text-xs mb-3">Type your ingredients list here. Add one ingredient per line.</p>
          <Controller name="recipeIngredient" control={control} render={({ field }) => <Textarea placeholder={`1 cup flour
2 tsp salt
...etc`} minHeight={100} className="placeholder:text-gray-300 resize-none w-full rounded-md border-gray-200" {...field} ref={ingredientsRef} />} />
        </div>
        <div className="col-span-8 md:col-span-5 print:col-span-5 print:mt-2" id="directions">
          <h2 className="text-xl font-bold mb-2">Directions</h2>
          <ol className="[counter-reset: step]">
            {fields.map((field, i) => (
              <li key={field.id} className="mb-2 before:text-brand-alt grid grid-cols-12 before:content-[counter(step)] before:font-bold before:text-xl print:before:text-right print:before:pr-3 [counter-increment:step]">
                <span className="grid grid-cols-12 gap-2 flex-grow col-span-11">
                  <Controller name={`recipeInstructions.${i}.text`} control={control} render={({ field }) => <Textarea className="resize-none w-full rounded-md border-gray-200 col-span-11" {...field} onKeyDown={(e) => {
                    if (e.code === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      append({ text: '' })
                      setFocus(`recipeInstructions.${recipe.recipeInstructions.length}.text`)
                    }
                  }} />} />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)}>
                      <MinusIcon className="w-5" />
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ol>
          {recipe.recipeInstructions[recipe.recipeInstructions.length - 1]?.text && (
            <div className="grid grid-cols-12">
              <Button type="button" block appearance="secondary" icon={<PlusIcon className="w-5" />} onClick={() => append({ text: '' })} className="col-span-10 col-start-2">
                Add step
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="text-center pt-6 border-t border-t-gray-200 mt-6 flex justify-between">
        <div>
          <Button appearance="link" onClick={() => router.push(handle ? `/recipes/view/${handle}` : '/recipes')}>Cancel</Button>
        </div>
        <div className="flex gap-4">
          {handle && <Button appearance="link" className="text-red-800" onClick={onDelete}>Delete</Button>}
          <Button size="lg" type="submit">Save</Button>
        </div>
      </div>
    </form>
  )
}