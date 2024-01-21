'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import React, { ReactElement, useState } from 'react'
import QuickSearch from './QuickSearch'
import { Input } from '../input'

type Props = {
  open?: boolean
}
export default function ParseRecipeDialog({ open }: Props) {
  const [value, setValue] = useState<string>('')
  return (
    <Dialog.Root open={open} >
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
            <h1 className="font-display text-primary text-3xl mb-3">New Collection</h1>
            <label htmlFor="collectionName">Name</label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} id="collectionName" name="collectionName" />
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}