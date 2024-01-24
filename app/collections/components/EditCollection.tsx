'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Collection } from '@/lib/types'
import { PencilIcon } from '@heroicons/react/24/solid'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  collection: Collection;
  onConfirm: (values: Inputs) => void;
  trigger: React.JSX.Element;
}

const DefaultTrigger = () => <Button variant="ghost" className="opacity-0 group-hover:opacity-100"><PencilIcon /></Button>

const FormSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1, { message: 'Required' })
  })

type Inputs = z.infer<typeof FormSchema>

export default function EditCollection({ collection, onConfirm, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const form = useForm<Inputs>({
    defaultValues: {
      id: collection.id,
      name: collection.name
    }
  })

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        {trigger || <DefaultTrigger />}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed bg-slate-900/70 w-full h-full top-0 left-0 z-20" />
        <div className="p-4 fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center">
          <AlertDialog.Content className="w-[95vw] max-w-xl rounded-lg p-4 md:w-full max-h-full overflow-aut bg-white dark:bg-gray-800">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(async values => {
                await onConfirm(values)
                setOpen(false)
              })}>
                <AlertDialog.Title className="font-display text-primary text-2xl font-semibold mb-3">Edit {collection.name}</AlertDialog.Title>
                <AlertDialog.Description asChild className="text-md">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            autoFocus
                            type="text"
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AlertDialog.Description>
                <div className="flex justify-end align-center mt-4 space-x-3">
                  <AlertDialog.Cancel asChild>
                    <Button variant="link" className="text-slate-800">Cancel</Button>
                  </AlertDialog.Cancel>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}