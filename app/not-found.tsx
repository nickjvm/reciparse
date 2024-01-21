import { Button } from '@/components/ui/button'
import FixedWidth from '@/components/ui/templates/FixedWidth'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <FixedWidth className="max-w-xl text-center h-full">
      <div>
        <Image className="block mb-5 mx-auto" src="/404.svg" alt="parse error" width="150" height="150" />
        <h1 className="font-display text-4xl text-primary text-center font-semibold mb-3">Page Not Found.</h1>
      </div>
      <Button variant="outline" className="mt-5" size="lg">
        <Link href="/" className="flex gap-2 items-center">
          Return home
        </Link>
      </Button>
    </FixedWidth>
  )
}