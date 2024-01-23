'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sendPasswordReset } from '../actions'
import { useTransition } from 'react'

const FormSchema = z.object({
  email: z.string().email()
})

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const { error } = await sendPasswordReset(data.email)

      toast({
        variant: error ? 'destructive' : 'default',
        title: error ? 'Something went wrong' : 'Sent!',
        description: error ? error.message : 'Check your email to complete your password reset.'
      })

      if (!error) {
        form.setValue('email', '')
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@gmail.com"
                  {...field}
                  type="email"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full flex gap-2">
					Submit
          {isPending && <AiOutlineLoading3Quarters className={cn('animate-spin')} />}
        </Button>
      </form>
    </Form>
  )
}
