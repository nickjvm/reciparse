'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FieldErrors, useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Collection, DBRecipe } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Switch } from '@headlessui/react'
import * as Tabs from '@radix-ui/react-tabs'
import Link from 'next/link'
import DurationInput from './DurationInput'
import { deleteRecipe, updateRecipe } from '../[handle]/edit/actions'
import { useToast } from '@/components/ui/use-toast'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Cross2Icon, TrashIcon } from '@radix-ui/react-icons'
import SectionSteps from './SectionSteps'
import { FormSchema, FieldName, Inputs, triggerByKeyGenerate } from '../[handle]/edit/schema'
import DeleteRecipe from '../[handle]/edit/components/DeleteRecipe'
import { createRecipe } from '../actions'
import { useEffect } from 'react'
import Image from 'next/image'
import PlaceholderImage from '@/components/ui/atoms/PlaceholderImage'

type Props = {
  recipe: DBRecipe
  collections: Collection[]
}

const defaultRecipe = {
  name: '',
  ingredients: '',
  is_public: false,
  instructions: [{
    name: 'Instructions',
    steps: [{
      text: ''
    }]
  }]
}

export default function TabNav({ recipe, collections }: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const toast = useToast()

  const form = useForm<Inputs>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...defaultRecipe,
      ...{
        ...recipe,
        ingredients: recipe?.ingredients?.join('\n'),
      },
    }
  })

  useEffect(() => {
    router.push(`${pathname}?tab=${tabs[0].value}`)
  }, [])
  const triggerByKey = triggerByKeyGenerate(form.getValues, form.trigger, { shouldFocus: true })

  const tabs = [{
    value: 'general',
    label: 'Overview',
    fields: ['name', 'collection_id', 'source', 'is_public', 'prepTime', 'cookTime', 'totalTime', 'yield']
  }, {
    value: 'ingredients',
    label: 'Ingredients',
    fields: ['ingredients']
  }, {
    value: 'directions',
    label: 'Directions & Steps',
    fields: ['instructions']
  }]

  const activeTab = tabs.find(t => t.value === searchParams.get('tab')) || tabs[0]
  const activeTabValue = activeTab.value
  const activeTabIndex = tabs.findIndex(tab => tab.value === activeTabValue)

  const onSubmitError = (errors: FieldErrors) => {
    const [firstErrorField] = Object.keys(errors)
    const [firstError] = firstErrorField.split('.')
    let tabContainingError = 'general'
    if (['ingredients'].includes(firstError) && searchParams.get('tab') !== 'ingredients') {
      tabContainingError = 'ingredients'
    } else if (['instructions'].includes(firstError)) {
      tabContainingError = 'directions'
    }
    if (searchParams.get('tab') !== tabContainingError) {
      router.push(`${pathname}?tab=${tabContainingError}`)
    }
  }

  const stepIsValid = async () => {
    const fields = activeTab.fields
    const output = []
    for (let i = 0; i < fields.length; i++) {
      output.push(await triggerByKey(fields[i] as FieldName))
    }
    if (output.some(v => !v)) {
      return false
    }
    return true
  }
  const next = async (e: React.FormEvent) => {
    e.preventDefault()

    if (await stepIsValid()) {
      if (activeTabValue === tabs[tabs.length - 1].value || recipe?.id) {
        await form.handleSubmit(onSubmit, onSubmitError)()
      } else {
        router.push(`${pathname}?tab=${tabs[activeTabIndex + 1].value}`)
      }
    }
  }
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    let data = null
    let error = null

    const formData = new FormData()
    if (values.upload) {
      formData.append('file', values.upload)
      delete values.upload
    }

    console.log(values)
    if (recipe?.id) {
      ({ data, error } = await updateRecipe(recipe.id, values, formData))

      toast.toast({
        variant: error ? 'destructive' : 'default',
        title: error ? 'Error' : 'Success!',
        description: error ? error.message : <p>Your recipe has been updated. <Link href={`/recipes/${data?.id}`} onClick={() => toast.dismiss()} className="underline">View</Link></p>
      })

      if (data) {
        (data as DBRecipe).ingredients = data.ingredients.join('\n')
        form.reset(data as DBRecipe)
      }
    } else {

      try {
        ({ data, error } = await createRecipe(values, formData))
      } catch (e) {
        console.log(e)
      }
      if (data) {
        router.push(`/recipes/${data.id}`)
      }
      toast.toast({
        variant: error ? 'destructive' : 'default',
        title: error ? 'Error' : 'Success!',
        description: error ? error.message : <p>Your recipe has been created!</p>
      })
    }
  }


  const { fields: instructions, append: addSection, remove: removeSection } = useFieldArray({ control: form.control, name: 'instructions' })

  const onTabChange = async (value: string) => {
    const desiredIndex = tabs.findIndex(tab => tab.value === value)
    let canChange = true
    if (!recipe?.id) {
      canChange = desiredIndex < activeTabIndex
    }

    if (canChange) {
      router.push(`${pathname}?tab=${value}`)
    }
  }

  const imagePreview = form.watch('image')

  return (
    <Tabs.Root className="TabsRoot"value={activeTabValue} onValueChange={onTabChange}>
      <div className="grid grid-cols-4 gap-6 items-start">
        <Tabs.List aria-label="Edit recipe" className="-mx-4 col-span-4 md:col-span-1 flex md:flex-col rounded overflow-hidden mb-3 whitespace-nowrap">
          {tabs.map(tab => (
            <Tabs.Trigger key={tab.value} className={cn(
              'group text-left md:shrink-0',
              'md:first:rounded-t-lg md:last:rounded-b-lg',
              'border border-slate-100',
              'w-[45%] md:w-full',
              'text-center md:text-left',
              'radix-state-active:border-b-primary focus-visible:radix-state-active:border-b-transparent radix-state-inactive:bg-slate-100 dark:radix-state-active:border-b-gray-100 dark:radix-state-active:bg-gray-900 focus-visible:dark:radix-state-active:border-b-transparent dark:radix-state-inactive:bg-gray-800',
              'flex-1 px-3 py-2.5',
              'focus:radix-state-active:border-b-red',
              'focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75'
            )} value={tab.value}>
              {tab.label}
            </Tabs.Trigger>
          ))}
          {recipe && <DeleteRecipe id={recipe.id} onConfirm={deleteRecipe} />}
        </Tabs.List>
        <div className="col-span-4 md:col-span-3">
          <Tabs.Content value="general">
            <form className="space-y-6" onSubmit={next}>
              <div className="grid grid-cols-8 gap-3 md:gap-6">
                <div className="col-span-8 md:col-span-2 row-span-3 row-start-2 md:row-start-1">
                  <label htmlFor="name" className="text-sm text-slate-600 relative">
                    <span className="md:hidden">Photo</span>
                    <Input {...form.register('upload')} className="md:opacity-0 md:absolute md:top-0 md:left-0 w-full md:h-full cursor-pointer" type="file" onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files) {
                        const file = e.target.files[0]
                        if (file) {
                          form.setValue('upload', file)
                          const output = await form.trigger('upload')
                          if (output) {
                            form.setValue('image', URL.createObjectURL(file))
                          }
                        }
                      }
                    }}/>
                    <div className="hidden md:block">
                      {imagePreview
                        ? <Image src={imagePreview} className="aspect-square object-cover" alt="image preview" width="200" height="200" />
                        : <PlaceholderImage text="Click to upload a photo" />
                      }
                      {imagePreview && <button className="absolute top-1 right-1 p-2 shadow bg-white bg-opacity-75 text-red-600 rounded-full" onClick={() => {
                        form.unregister('upload')
                        form.setValue('image', null)
                      }}><Cross2Icon /></button>}
                    </div>
                  </label>
                  {form.formState.errors.upload && <div className="text-red-800 mt-2 text-sm">{`${form.formState.errors.upload?.message}`}</div>}
                </div>
                <div className="col-span-8 md:col-span-4">
                  <label htmlFor="name" className="text-sm text-slate-600">Recipe name</label>
                  <Input {...form.register('name')} type="text" className="w-full"/>
                  <div className="text-red-800 mt-2 text-sm">{form.formState.errors.name?.message}</div>
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label htmlFor="collection_id" className="text-sm text-slate-600">Collection</label>
                  <select {...form.register('collection_id')} className="bg-white flex h-9 w-full rounded-md border border-input px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    {collections.map(collection => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
                  </select>
                </div>
                <div className="col-span-8 md:col-span-6">
                  <label htmlFor="source" className="text-sm text-slate-600">Source URL</label>
                  <Input {...form.register('source')} type="text" className="w-full"/>
                </div>
                <div className="col-span-8 md:col-start-3 md:col-span-6 space-y-4">
                  <div className="items-center flex gap-4">
                    <Controller control={form.control} name="is_public" render={({ field }) => {
                      return (
                        <>
                          <Switch
                            {...field}
                            value="on"
                            checked={field.value}
                            className={cn(
                              'relative inline-flex h-6 w-11 items-center rounded-full focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2',
                              field.value  ? 'bg-brand' : 'bg-slate-200'
                            )}>
                            <span className="sr-only">Make this recipe public or private</span>
                            <span
                              className={`${
                                field.value ? 'translate-x-6' : 'translate-x-1'
                              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                          </Switch>
                          <label className="text-sm text-slate-600">{
                            field.value
                              ? 'This recipe is publicly accessible'
                              : 'This recipe is private and only accessible by you'
                          }
                          </label>
                        </>
                      )
                    }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Controller control={form.control} name="prepTime" render={({ field }) => <DurationInput {...field} label="Prep Time" />} />
                    <Controller control={form.control} name="cookTime" render={({ field }) => <DurationInput {...field} label="Cook Time" />} />
                    <Controller control={form.control} name="totalTime" render={({ field }) => <DurationInput {...field} label="Total Time" />} />
                  </div>
                  <div className="grid grid-cols-5 md:grid-cols-3 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label htmlFor="name" className="text-sm text-slate-600">Recipe Yield</label>
                      <div className="flex items-center gap-4">
                        <Input {...form.register('yield', { setValueAs: (v) => v === '' || v === null ? undefined : Number(v) || undefined})} type="text" className="w-full"/>
                        <span className="text-sm text-slate-600">serving(s)</span>
                      </div>
                      <div className="text-red-800 mt-2 text-sm">{form.formState.errors.yield?.message}</div>
                    </div>
                  </div>
                  <div className="col-start-2 col-span-3 text-center mt-3 gap-4 flex items-center justify-end">
                    <Link href={recipe ? `/recipes/${recipe.id}` : '/recipes'} className="underline text-slate-600 text-sm">Cancel</Link>
                    <Button>{recipe?.id ? 'Save' : 'Continue'}</Button>
                  </div>
                </div>
              </div>
            </form>
          </Tabs.Content>
          <Tabs.Content className="TabsContent" value="ingredients">
            <form className="space-y-6" onSubmit={next}>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4 md:col-span-3">
                  <label htmlFor="name" className="sr-only text-xl font-semibold text-slate-600">Ingredients</label>
                  <p className="text-slate-800 mb-2">Enter the ingredients for this recipe, one per line.</p>
                  <textarea
                    {...form.register('ingredients')}
                    className="bg-white flex h-96 w-full rounded-md border border-input px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <div className="text-red-800 mt-2 text-sm">{form.formState.errors?.ingredients?.message}</div>
                </div>
              </div>
              <div className="col-start-2 col-span-3 text-center mt-3 gap-4 flex items-center justify-end">
                <Link href={recipe ? `/recipes/${recipe.id}` : '/recipes'} className="underline text-slate-600 text-sm">Cancel</Link>
                <Button>{recipe?.id ? 'Save' : 'Continue'}</Button>
              </div>
            </form>
          </Tabs.Content>
          <Tabs.Content value="directions">
            <form className="space-y-5" onSubmit={next}>
              {instructions.map((section, i) => {
                return (
                  <div key={section.id} className="space-y-3">
                    <div>
                      <label htmlFor={`instructions.${i}.name`} className="text-sm text-slate-600">Section name</label>
                      <div className="relative">
                        <Input key={section.id} {...form.register(`instructions.${i}.name`)} className="w-full" />
                        {instructions.length > 1 && <Button type="button" className="absolute right-0 top-1/2 -translate-y-1/2" variant="ghost" onClick={() => removeSection(i)}><TrashIcon /></Button>}
                      </div>
                      <div className="text-red-800 mt-2 text-sm">{form.formState.errors.instructions?.[i]?.name?.message}</div>
                    </div>
                    <ol className="list-decimal ml-6 space-y-3">
                      <SectionSteps sectionIndex={i} form={form} addSection={i === instructions.length - 1 ? addSection : null} />
                    </ol>
                  </div>
                )
              })}
              <div className="col-start-2 col-span-3 text-center mt-3 gap-4 flex items-center justify-end">
                <Link href={recipe ? `/recipes/${recipe.id}` : '/recipes'} className="underline text-slate-600 text-sm">Cancel</Link>
                <Button>{recipe?.id ? 'Save' : 'Save & Finish'}</Button>
              </div>
            </form>
          </Tabs.Content>
        </div>
      </div>
    </Tabs.Root>
  )
}