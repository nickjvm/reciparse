'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import React, { ReactElement, useState } from 'react'
import QuickSearch from './QuickSearch'

type Props = {
  trigger: ReactElement
}
export default function ParseRecipeDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} >
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed bg-slate-900/70 w-full h-full top-0 left-0 z-[60]" />
        <div className="p-4 fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center">
          <Dialog.Content onCloseAutoFocus={(e) => e.preventDefault()} className={cn(
            'w-[95vw] max-w-xl rounded-lg p-8 md:w-full max-h-full overflow-auto',
            'bg-white dark:bg-gray-800 relative',
          )}>
            <Dialog.Close asChild>
              <button className="absolute right-4 top-4" aria-label="Close">
                <Cross2Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>
            <h1 className="font-display text-primary text-3xl mb-3">Parse a Recipe</h1>
            <p className="text-slate-800 mb-6">Entere a recipe URL in the field below and watch the magic happen.</p>
            <QuickSearch autoFocus onSubmitSuccess={() => setOpen(false)} />
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}