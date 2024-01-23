import { cn } from '@/lib/utils'
import { handleSignOut } from '../actions'


export default function SignOut({ className }: {className?: string}) {
  return (
    <form action={handleSignOut} className={cn('inline-block', className)}>
      <button>Sign Out</button>
    </form>
  )
}