'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { parse, Duration } from 'iso8601-duration'
import Image from 'next/image'
import Textarea from '@/components/atoms/Textarea'
import { MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Button from '@/components/atoms/Button'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import request from '@/lib/api'
import { CustomRecipe } from '@/types'
import useAutosizeTextArea from '@/hooks/useAutosizeTextarea'
import PlaceholderImage from '@/components/atoms/PlaceholderImage'
import FormError from '@/components/atoms/FormError'


export type FormValues = {
  id?: number
  handle?: string
  name: string
  recipeInstructions: {
    text: string
  }[],
  file?: File
  image: string
  recipeYield: number
  prepTime: Duration
  cookTime: Duration
  recipeIngredient: string
}

type Props = {
  onSubmit: (values: FormValues) => void
  onLoad?: (values: CustomRecipe) => void
}

const numeric = (v?: number) => {
  return !v || !!`${v}`.match(/^[0-9]+$/) || 'Enter a number'
}
const positive = (v?: number) =>{
  return !v || (Number(v) >= 0) || 'Enter a positive number'
}

const wholeNumber = (v?: number) =>{
  return !v || Number(v) === Math.floor(Number(v)) || 'Enter a whole number'
}

export default function AddEditForm({ onSubmit, onLoad }: Props) {
  const { handle } = useParams()
  const router = useRouter()
  const { register, reset, control, watch, handleSubmit, setFocus, setValue, unregister, formState: { errors }, setError, clearErrors } = useForm<FormValues>({
    defaultValues: {
      name: '',
      recipeYield: 4,
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
    rules: {
      minLength: {
        message: 'Enter details for at least one step',
        value: 1,
      }
    },
    name: 'recipeInstructions',
  })

  const recipe = watch()
  useEffect(() => {
    if (!handle || handle === recipe.handle) {
      return
    }

    request(`/api/recipes/custom/${handle}`).then(({ data }: { data: null|CustomRecipe, error: null|Error}) => {
      if (data) {
        const { name, prepTime = '', cookTime = '', recipeYield = 0, id, image } = data
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

  const uploadRef = useRef<HTMLLabelElement|null>(null)
  if (handle && !recipe.id) {
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024 * 5
    if (e.target.files) {
      const file = e.target.files[0]
      if (file) {
        if (file.size > maxSize) {
          setError('image', { message: 'Selected image is too large' })
          clearImage()
        } else if (!file.type.match(/png|jpe?g|gif/)) {
          setError('image', { message: 'Unsupported file type' })
          clearImage()
        } else {
          clearErrors('image')
          setValue('image', URL.createObjectURL(file))
          setValue('file', file)
        }
      }
    } else {
      clearImage()
    }
  }

  const clearImage = () => {
    setValue('image', '')
    clearErrors('image')
    unregister('file')
    if (uploadRef.current) {
      const input = uploadRef.current.querySelector('input')
      if (input) {
        input.value = ''
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <header className="grid auto-rows-auto md:grid-cols-12 print:grid-cols-12 gap-4 mb-4">
        <div className="relative w-full md:col-span-3 print:col-span-3">
          <label ref={uploadRef} htmlFor="uploadImage" className="cursor-pointer">
            {recipe.image && <Image className="w-full rounded aspect-square" style={{ objectFit: 'cover' }} alt={recipe.name} width={150} height={150} src={recipe.image} />}
            {!recipe.image && <PlaceholderImage text="click to upload" />}
            <span className="sr-only">Click to upload an image</span>
            <input type="file" accept="image/*" className="invisible absolute" id="uploadImage" onChange={handleFileChange} onInput={handleFileChange} />
          </label>
          {recipe.image && (
            <div className="flex justify-between">
              <button type="button" onClick={() => uploadRef?.current?.click()} className="text-sm flex gap-1 text-brand-alt items-center">Change</button>
              <button type="button" onClick={clearImage} className="text-sm flex gap-1 text-red-800 items-center"><XMarkIcon className="w-4" />Remove</button>
            </div>
          )}
          <FormError message={errors.image?.message} />
        </div>
        <div className="md:col-span-9 print:col-span-8">
          <div className="mb-4">
            <input {...register('name', { required: 'Required'})} autoFocus placeholder="Recipe Title" className="placeholder:text-gray-300 w-full rounded-md border-gray-200 font-display text-brand-alt text-3xl font-bold" />
            <FormError message={errors.name?.message} />
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="">
              <label htmlFor="recipeYield" className="text-xs mb-2 text-slate-500">Yield</label>
              <div className="flex rounded-md ring-1 ring-inset ring-gray-300 items-center">
                <input {...register('recipeYield', {
                  validate: {
                    numeric,
                    positive,
                    wholeNumber,
                  },
                })} type="text" name="recipeYield" id="price" className="rounded-md block w-12 text-center border-0 py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent" />
                <div className=" inset-y-0 right-0 flex items-center h-full rounded-md border-0 bg-transparent py-0 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                  servings
                </div>
              </div>
              <FormError message={errors.recipeYield?.message} />
            </div>
            <div>
              <div className="mb-2">
                <label htmlFor="preptime" className="text-xs mb-2 text-slate-500">Prep Time</label>
                <div className="flex rounded-md ring-1 ring-inset ring-gray-300 items-center">
                  <input {...register('prepTime.hours', {
                    validate: {
                      positive,
                      wholeNumber,
                    },
                  })} type="text" className="text-center block w-12 rounded-md border-0 py-1.5 px-4 text-gray-900 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  <div className="inset-y-0 right-0 flex items-center h-full rounded-md border-0 bg-transparent py-0 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                    hours
                  </div>
                </div>
                <FormError message={errors.prepTime?.hours?.message} />
              </div>
              <div>
                <div className="flex rounded-md ring-1 ring-inset ring-gray-300 items-center">
                  <input {...register('prepTime.minutes', {
                    validate: {
                      positive,
                      wholeNumber,
                    },
                  })} className="text-center block w-12 rounded-md border-0 py-1.5 px-4 text-gray-900 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  <div className="inset-y-0 right-0 flex items-center h-full rounded-md border-0 bg-transparent py-0 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                    minutes
                  </div>
                </div>
                <FormError message={errors.prepTime?.minutes?.message} />
              </div>
            </div>
            <div>
              <div className="mb-2">
                <label htmlFor="cooktime" className="text-xs mb-2 text-slate-500">Cook Time</label>
                <div className="flex rounded-md ring-1 ring-inset ring-gray-300 items-center">
                  <input {...register('cookTime.hours', {
                    validate: {
                      positive,
                      wholeNumber,
                    },
                  })} className="text-center block w-12 rounded-md border-0 py-1.5 px-4 text-gray-900 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  <div className="inset-y-0 right-0 flex items-center">
                    <div className="inset-y-0 right-0 flex items-center h-full rounded-md border-0 bg-transparent py-0 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                      hours
                    </div>
                  </div>
                </div>
                <FormError message={errors.cookTime?.hours?.message} />
              </div>
              <div>
                <div className="flex rounded-md ring-1 ring-inset ring-gray-300 items-center">
                  <input {...register('cookTime.minutes', {
                    validate: {
                      positive,
                      wholeNumber,
                    },
                  })} className="text-center block w-12 rounded-md border-0 py-1.5 px-4 text-gray-900 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  <div className="inset-y-0 right-0 flex items-center">
                    <div className="inset-y-0 right-0 flex items-center h-full rounded-md border-0 bg-transparent py-0 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                      minutes
                    </div>
                  </div>
                </div>
                <FormError message={errors.cookTime?.minutes?.message} />
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
          <Controller rules={{ required: 'Required' }} name="recipeIngredient" control={control} render={({ field }) => (
            <>
              <Textarea
                placeholder={`1 cup flour
2 tsp salt
...etc`}
                minHeight={100}
                className="placeholder:text-gray-300 resize-none w-full rounded-md border-gray-200"
                {...field} ref={ingredientsRef}
              />
              <FormError message={errors.recipeIngredient?.message} />
            </>
          )}
          />
        </div>
        <div className="col-span-8 md:col-span-5 print:col-span-5 print:mt-2" id="directions">
          <h2 className="text-xl font-bold mb-2">Directions</h2>
          <ol className="[counter-reset: step]">
            {fields.map((field, i) => (
              <li key={field.id} className="mb-2 before:text-brand-alt grid grid-cols-12 before:content-[counter(step)] before:font-bold before:text-xl print:before:text-right print:before:pr-3 [counter-increment:step]">
                <span className="grid grid-cols-12 gap-2 flex-grow col-span-11 items-start">
                  <Controller rules={{ required: 'Required' }} name={`recipeInstructions.${i}.text`} control={control} render={({ field, fieldState }) => (
                    <div className="col-span-11">
                      <Textarea className="resize-none w-full rounded-md border-gray-200 col-span-11" {...field} onKeyDown={(e) => {
                        if (e.code === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          append({ text: '' })
                          setFocus(`recipeInstructions.${recipe.recipeInstructions.length}.text`)
                        }
                      }} />
                      <FormError message={fieldState.error?.message} />
                    </div>
                  )} />
                  {fields.length > 1 && (
                    <button type="button" className="mt-3" onClick={() => remove(i)}>
                      <MinusIcon className="w-5" />
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ol>
          <FormError message={errors.recipeInstructions?.root?.message} />
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