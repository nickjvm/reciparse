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
import { confirmResetPassword } from '../actions'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  passwordConfirm: z.string()
})
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'], // path of error
  })

export default function ResetPasswordForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      passwordConfirm: ''
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const { error } = await confirmResetPassword(data.password)

      toast({
        variant: error ? 'destructive' : 'default',
        title: error ? 'Something went wrong' : 'Success!',
        description: error ? error.message : 'Your password has been reset.'
      })

      router.push('/')
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
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
