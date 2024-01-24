'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { DBRecipe, PostgrestResponseFailure } from '@/lib/types'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { TrashIcon } from '@radix-ui/react-icons'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { forwardRef } from 'react'

type Props = {
  recipe: DBRecipe;
  onConfirm: (id: string) => Promise<PostgrestResponseFailure|PostgrestSingleResponse<null>>;
  trigger?: React.JSX.Element
}

const DefaultTrigger = forwardRef<HTMLButtonElement>((props, forwardedRef) => <Button {...props} ref={forwardedRef} variant="outline" className="flex items-center gap-2 m-auto mt-6"><TrashIcon /> Delete Recipe</Button>)

DefaultTrigger.displayName = 'DefaultTrigger'

export default function DeleteRecipe({ recipe, onConfirm, trigger }: Props) {
  const router = useRouter()

  return (
    <div onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
    }}>

      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          {trigger || <DefaultTrigger />}
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed bg-slate-900/70 w-full h-full top-0 left-0 z-20" />
          <div className="p-4 fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center">
            <AlertDialog.Content className="w-[95vw] max-w-xl rounded-lg p-4 md:w-full max-h-full overflow-aut bg-white dark:bg-gray-800">
              <AlertDialog.Title className="font-display text-primary text-2xl font-semibold mb-3">Are you sure you want to delete {recipe.name}?</AlertDialog.Title>
              <AlertDialog.Description className="text-md">
              This will permanently delete the recipe. This action cannot be undone.
              </AlertDialog.Description>
              <div className="flex justify-end align-center mt-4 space-x-3">
                <AlertDialog.Cancel asChild>
                  <Button variant="link" className="text-slate-800">Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button variant="destructive" onClick={async () => {
                    const { error } = await onConfirm(recipe.id)
                    if (!error) {
                      router.push('/recipes')
                      toast({
                        title: 'Recipe deleted',
                        description: 'The recipe has been deleted successfully.'
                      })
                    } else {
                      console.log(error)
                    }
                  }}>Yes, delete the recipe</Button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </div>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  )
}