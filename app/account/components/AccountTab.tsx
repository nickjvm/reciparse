import Heading from '@/components/ui/atoms/Heading'
import { Input } from '@/components/ui/input'
import { Session } from '@supabase/supabase-js'
import { updateUserProfile } from '../actions'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { toast } from '@/components/ui/use-toast'

type Props = {
  session: Session
}


const FormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1, {
      message: 'Password is required.',
    }),
    newPassword: z.string().min(8, {
      message: 'New password must be at least 8 characters.',
    }).or(z.literal(''))
  })
  // .refine((data) => !!data.newPassword.length && data.newPassword.length < 6, {
  //   message: 'New password must be at least 6 characters',
  //   path: ['newPassword'],
  // })

type Inputs = z.infer<typeof FormSchema>

export default function AccountTab({ session }: Props) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<Inputs>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: session?.user?.email,
      password: '',
      newPassword: '',
    },
  })

  const onSubmit = (values: Inputs) => {
    startTransition(async () => {
      const { error, data } = await updateUserProfile(values)

      if (data?.emailChanged) {
        toast({
          variant: 'default',
          title: 'Check your email.',
          description: 'We sent you an email to confirm your email address change.',
        })
      } else {
        toast({
          variant: error ? 'destructive' : 'default',
          title: error ? 'Something went wrong' : 'Success!',
          description: error ? error.message : 'Your account has been updated.'
        })
      }

      form.setValue('password', '')
      form.setValue('newPassword', '')
    })
  }
  return (
    <>
      <Heading>Sign In & Security</Heading>
      <form className="space-y-4 max-w-96" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="col-span-8 md:col-span-6 space-y-1">
          <label className="text-sm text-slate-600" htmlFor="email">Email Address</label>
          <Input {...form.register('email')} />
          {form.formState.errors.email && <div className="text-red-800 mt-2 text-sm">{form.formState.errors.email?.message}</div>}
        </div>
        <div className="col-span-8 md:col-span-6 space-y-1">
          <label className="text-sm text-slate-600" htmlFor="password">Current Password</label>
          <Input type="password" {...form.register('password')} />
          {form.formState.errors.password && <div className="text-red-800 mt-2 text-sm">{form.formState.errors.password?.message}</div>}
        </div>
        <div className="col-span-8 md:col-span-6 space-y-1">
          <label className="text-sm text-slate-600" htmlFor="newPassword">Change Password</label>
          <p className="text-xs text-slate-500">Leave blank if you do not want to change your password.</p>
          <Input type="password" {...form.register('newPassword')} />
          {form.formState.errors.newPassword && <div className="text-red-800 mt-2 text-sm">{form.formState.errors.newPassword?.message}</div>}
        </div>
        <div>
          <Button>
            {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : 'Update'}
          </Button>
        </div>
      </form>
    </>
  )
}