'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '../button'
import { HeartIcon } from '@heroicons/react/24/outline'
import { Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import createSupabaseBrowserClient from '@/lib/supabase/client'
import { useEffect, useState, useTransition } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { copyRecipe } from './actions'
import { useRouter } from 'next/navigation'
import { Recipe } from '@/lib/types'

type Collection = {
  name: string,
  id: string,
}
export default function SaveRecipe({ recipe, source }: { recipe: Recipe, source?: string|null }) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [collectionName, setCollectionName] = useState('')

  const router = useRouter()

  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, startLoadingTransition] = useTransition()
  const [isSaving, startSavingTransition] = useTransition()
  const getCollections = () => {
    startLoadingTransition(async () => {
      const supabase = await createSupabaseBrowserClient()
      const { data } = await supabase.from('collections').select()
      if (data) {
        setCollections(data)
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setValue(e.target.value)
  }

  useEffect(() => {
    if (open) {
      getCollections()
    } else {
      setValue('')
      setError('')
      setCollectionName('')
    }
  }, [open])

  const handleCollectionNameFocus = () => {
    setValue('-1')
    setError('')
  }

  const valid = (value && value !== '-1') || (value === '-1' && collectionName)

  const handleSubmit = async () => {
    startSavingTransition(async () => {
      try {
        const data = await copyRecipe({ id: value, collectionName, recipe, source })
        setOpen(false)
        router.push(`/recipes/${data.id}`)
      } catch (e) {
        setError((e as Error).message)
      }
    })
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="print:hidden hidden sm:inline-flex gap-2">
          <HeartIcon className="w-5 group-hover:stroke-brand-alt group-hover:fill-white" />
          <span>Save</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed bg-slate-900/70 w-full h-full top-0 left-0 z-20" />
        <div className="p-4 fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center">
          <Dialog.Content className={cn(
            'w-[95vw] max-w-xl rounded-lg p-4 md:w-full max-h-full overflow-auto',
            'bg-white dark:bg-gray-800',
          )}>
            <Dialog.Close asChild>
              <button className="absolute right-4 top-4" aria-label="Close">
                <Cross2Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>
            <form action={handleSubmit}>
              <div className="text-center space-y-2 mb-4">
                <h2 className="font-display text-primary text-2xl font-medium">Save Recipe</h2>
                <p className="text-slate-500">Which collection do you want to save this recipe to?</p>
              </div>
              {isLoading && !collections.length && <AiOutlineLoading3Quarters className="m-auto animate-spin" />}
              <ul className="space-y-2">
                {collections.map(collection => {
                  return (
                    <li key={collection.id}>
                      <label className={cn('cursor-pointer block font-medium p-4 border border-slate-200 rounded', value === collection.id && 'border-primary')}>
                        <input name="collectionId" type="radio" value={collection.id} checked={value === collection.id} onChange={handleChange} className="absolute pointer-events-none opacity-0" />
                        {collection.name}
                      </label>
                    </li>
                  )
                })}
                <li>
                  <div className={cn('cursor-pointer block font-medium border border-slate-200 rounded', value === '-1' && 'border-primary')}>
                    <label className="sr-only">Create a new collection</label>
                    <input type="text" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} placeholder="Create a new collection" className="w-full block p-4 rounded cursor-pointer focus:cursor-text" onFocus={handleCollectionNameFocus} />
                  </div>
                </li>
              </ul>
              <div className="text-center mt-4 space-y-2">
                {error && <div className="text-red-700 semibold">{error}</div>}
                <Button type="submit" disabled={!valid}>
                  {!isSaving ? 'Save Recipe' : <AiOutlineLoading3Quarters className="m-auto animate-spin" />}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}