'use client'

import { Button } from '@/components/ui/button'
import { Collection } from '@/lib/types'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { TrashIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

type Props = {
  collection: Collection;
  onConfirm: (id: string) => void;
}
export default function DeleteCollection({ collection, onConfirm }: Props) {
  const router = useRouter()
  return (
    <div onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
    }}>

      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <Button variant="ghost" className="opacity-0 group-hover:opacity-100"><TrashIcon /></Button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed bg-slate-900/70 w-full h-full top-0 left-0 z-20" />
          <div className="p-4 fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center">
            <AlertDialog.Content className="w-[95vw] max-w-xl rounded-lg p-4 md:w-full max-h-full overflow-aut bg-white dark:bg-gray-800">
              <AlertDialog.Title className="font-display text-primary text-2xl font-semibold mb-3">Are you sure you want to delete the &quot;{collection.name}&quot; collection?</AlertDialog.Title>
              <AlertDialog.Description className="text-md">
              This will permanently delete the collection and any recipes saved to it. This action cannot be undone.
              </AlertDialog.Description>
              <div className="flex justify-end align-center mt-4 space-x-3">
                <AlertDialog.Cancel asChild>
                  <Button variant="link" className="text-slate-800">Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button variant="destructive" onClick={async () => {
                    await onConfirm(collection.id)
                    router.refresh()
                  }}>Yes, delete the collection</Button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </div>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  )
}