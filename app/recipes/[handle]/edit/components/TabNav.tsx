'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Collection, DBRecipe } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Switch } from '@headlessui/react'
import * as Tabs from '@radix-ui/react-tabs'
import Link from 'next/link'
import DurationInput from './DurationInput'
import { updateRecipe } from '../actions'
import { toast } from '@/components/ui/use-toast'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  recipe: DBRecipe
  collections: Collection[]
}

const FormSchema = z
  .object({
    name: z.string(),
    collection_id: z.string({ invalid_type_error: 'Please select a collection' }),
    source: z.string().optional(),
    prepTime: z.string().optional(),
    cookTime: z.string().optional(),
    totalTime: z.string().optional(),
    yield: z.number({ invalid_type_error: 'Please enter a number' }).min(1).optional(),
    is_public: z.boolean(),
    ingredients: z.string().array(),
    instructions: z.object({
      name: z.string(),
      steps: z.object({
        name: z.string().optional(),
        text: z.string(),
      }).array(),
    }).array(),
    image: z.string().url().optional()
  })
export default function TabNav({ recipe, collections }: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...recipe,
    }
  })

  const tabs = [{
    value: 'general',
    label: 'Overview',
  }, {
    value: 'ingredients',
    label: 'Ingredients',
  }, {
    value: 'directions',
    label: 'Directions & Steps',
  }]

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const { data, error } = await updateRecipe(recipe.id, values)
    form.reset(data)

    toast({
      variant: error ? 'destructive' : 'default',
      title: error ? 'Error' : 'Success!',
      description: error ? error.message : 'Your recipe has been updated.'
    })
  }
  const defaultTab = tabs.find(t => t.value === searchParams.get('tab'))?.value || tabs[0].value
  return (
    <Tabs.Root className="TabsRoot" defaultValue={defaultTab} onValueChange={value => router.push(`${pathname}?tab=${value}`)}>
      <div className="grid grid-cols-4 gap-6 items-start">
        <Tabs.List aria-label="Edit recipe" className="col-span-1 flex flex-col rounded overflow-hidden mb-3">
          {tabs.map(tab => (
            <Tabs.Trigger key={tab.value} className={cn(
              'group text-left',
              'first:rounded-t-lg last:rounded-b-lg',
              'border border-slate-100',
              'radix-state-active:border-b-primary focus-visible:radix-state-active:border-b-transparent radix-state-inactive:bg-slate-100 dark:radix-state-active:border-b-gray-100 dark:radix-state-active:bg-gray-900 focus-visible:dark:radix-state-active:border-b-transparent dark:radix-state-inactive:bg-gray-800',
              'flex-1 px-3 py-2.5',
              'focus:radix-state-active:border-b-red',
              'focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75'
            )} value={tab.value}>
              {tab.label}
            </Tabs.Trigger>
          ))}

        </Tabs.List>
        <div className="col-span-3">
          <Tabs.Content value="general">
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit, console.log)}>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label htmlFor="name" className="text-sm text-slate-600">Recipe name</label>
                  <Input {...form.register('name')} type="text" className="w-full"/>
                </div>
                <div>
                  <label htmlFor="collection_id" className="text-sm text-slate-600">Collection</label>
                  <select {...form.register('collection_id')} className="bg-white flex h-9 w-full rounded-md border border-input px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    {collections.map(collection => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="source" className="text-sm text-slate-600">Source URL</label>
                <Input {...form.register('source')} type="text" className="w-full"/>
              </div>
              <div className="items-center flex gap-3">
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
              <div className="grid grid-cols-5 gap-4">
                <Controller control={form.control} name="prepTime" render={({ field }) => <DurationInput {...field} label="Prep Time" />} />
                <Controller control={form.control} name="cookTime" render={({ field }) => <DurationInput {...field} label="Cook Time" />} />
                <Controller control={form.control} name="totalTime" render={({ field }) => <DurationInput {...field} label="Total Time" />} />
              </div>
              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <label htmlFor="name" className="text-sm text-slate-600">Recipe Yield</label>
                  <div className="flex items-center gap-4">
                    <Input {...form.register('yield', { setValueAs: (v) => v === '' ? undefined : Number(v)})} type="text" className="w-full"/>
                    <span className="text-sm text-slate-600">serving(s)</span>
                  </div>
                  <div className="text-red-800 mt-2 text-sm">{form.formState.errors.yield?.message}</div>
                </div>
              </div>
              <div className="text-center mt-3">
              </div>
              <div className="col-start-2 col-span-3 text-center mt-3 gap-4 flex items-center justify-end">
                <Link href={`/recipes/${recipe.id}`} className="underline text-slate-600 text-sm">Cancel</Link>
                <Button>Save</Button>
              </div>
            </form>
          </Tabs.Content>
          <Tabs.Content className="TabsContent" value="ingredients">
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit, console.log)}>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label htmlFor="name" className="sr-only text-xl font-semibold text-slate-600">Ingredients</label>
                  <p className="text-slate-800 mb-2">Enter the ingredients for this recipe, one per line.</p>
                  <Controller control={form.control} name="ingredients" render={({ field }) => {
                    const value = field.value.join('\n')
                    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      field.onChange(e.target.value.split('\n'))
                    }
                    return <textarea
                      {...form.register('ingredients')}
                      {...field}
                      value={value}
                      onChange={onChange}
                      className="bg-white flex h-96 w-full rounded-md border border-input px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  }} />
                </div>
              </div>
              <div className="col-start-2 col-span-3 text-center mt-3 gap-4 flex items-center justify-end">
                <Link href={`/recipes/${recipe.id}`} className="underline text-slate-600 text-sm">Cancel</Link>
                <Button>Save</Button>
              </div>
            </form>
          </Tabs.Content>
        </div>
      </div>
    </Tabs.Root>
  )
}