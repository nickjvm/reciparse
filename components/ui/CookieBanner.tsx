import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from './button'

type Props = {
  onAccept: () => void
}
export default function CookieBanner({ onAccept }: Props) {
  return (
    <div className={cn('z-[100000] rounded-lg p-3 ring-2 ring-primary fixed -translate-x-[50%] left-[50%] w-[90%] max-w-full md:max-w-2xl bg-white shadow bottom-2')}>
      <div className="grid grid-cols-12 gap-4 items-center mx-auto max-w-4xl">
        <div className="col-span-12 sm:col-span-9 text-sm">
          This website collects cookies to deliver better user experience. For more information, read our{' '}
          <Link className="underline whitespace-nowrap" href="/info/cookies">cookie policy</Link> and our <Link className="underline whitespace-nowrap" href="/info/privacy">privacy policy</Link>.
        </div>
        <div className="col-span-12 sm:col-span-3 text-center">
          <form action={onAccept}>
            <Button>Accept</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
