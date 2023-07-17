import { Metadata } from 'next'
import Link from 'next/link'
import { SparklesIcon } from '@heroicons/react/24/solid'

import withHeader from '@/components/hoc/withHeader'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Support | Reciparse'
}

function Page() {
  const linkClasses = 'underline text-brand-alt hover:text-brand hover:no-underline focus_visible:text-brand transition'
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
      <div className="md:col-span-3">
        <Image src="/avatar.jpg" width="100" height="100" className="rounded-full max-w-[225px] mx-auto w-full shadow ring-2 ring-offset-2 ring-brand mt-2" alt="Hi, I'm Nick" />
      </div>
      <div className="md:col-span-9">
        <h1 className="font-display text-3xl mb-3 text-brand-alt flex items-center">
          <SparklesIcon className="w-8 md:w-6 mr-3 flex-shrink-0" />
          Support the developer
        </h1>
        <p className="mb-4">
          Reciparse is a development project by <Link className={linkClasses} href="https://nickvanmeter.com/" target="_blank">Nick VanMeter</Link>.{' '}
          It was created mostly to demonstrate my skills and technical abilities (and a little bit because I enjoy cooking, and reading recipes online has turned into a real pain in the butt).
        </p>
        <p className="mb-4">Reciparse is built on <Link className={linkClasses} href="https://react.dev/" target="_blank">React</Link>/
          <Link className={linkClasses} href="https://nextjs.org/" target="_blank">Next.js</Link>,{' '}
          <Link className={linkClasses} href="https://nodejs.org/en" target="_blank">Node</Link>/
          <Link className={linkClasses} href="https://expressjs.com/" target="_blank">Express</Link>,{' '}
          <Link className={linkClasses} href="https://tailwindcss.com/" target="_blank">Tailwind</Link>,{' '}
          <Link className={linkClasses} href="https://supabase.com/" target="_blank">Supabase</Link>{' & '}
           and served to you via{' '}
          <Link className={linkClasses} href="https://vercel.com/" target="_blank">Vercel</Link>. The front end is open source and can be viewed on{' '}
          <Link className={linkClasses} href="https://github.com/nickjvm/reciparse" target="_blank">Github</Link>. Issues and pull requests from the community are welcome!
        </p>
        <p className="mb-4">
          If you like what you see and maybe I saved you a couple of minutes preparing dinner, I&apos;d appreciate your support — shoot me an email me at{' '}
          <Link className={linkClasses} href="mailto:nick@reciparse.com">nick@reciparse.com</Link> and let me know what you think. If you&apos;re feeling charitable,{' '}
          you can <Link className={linkClasses} href="https://bmc.link/nickvanmeter" target="_blank">fund my pantry here</Link>.
        </p>
      </div>
    </div>
  )
}

export default withHeader(Page, { withSearch: true })