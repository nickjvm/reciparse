import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  actionUrl?: string
  actionText?: string
  errorText?: string
}
export default function RecipeError({ actionUrl, actionText, errorText }: Props) {
  const external = actionUrl && actionUrl.startsWith('http')
  return (
    <div className="m-auto max-w-3xl mt-4 sm:mt-12 px-4 xl:px-0">
      <div className="grid grid-cols-12 items-center">
        <div className="col-span-12 sm:col-span-7 order-1 sm:order-0">
          <h2 className="text-brand-alt font-display text-4xl mb-4">Shoot.</h2>
          <p className="text-xl">{errorText || 'We tried our best, but couldn\'t find what you were looking for.'}</p>
          {actionUrl && actionText && (
            <Link
              className="text-center font-semibold block sm:inline-block mt-5 py-3 px-4 text-base bg-brand-alt hover:bg-brand focus-visible:bg-brand text-white transition rounded "
              href={actionUrl}
              target={external ? 'blank' : ''}
            >
              {actionText}
              {external && <ArrowTopRightOnSquareIcon className="inline ml-2 w-5 -mt-1" />}
            </Link>
          )}
        </div>
        <div className="col-span-12 sm:col-span-4 sm:col-start-9 order-0 sm:order-1">
          <Image className="m-auto block max-w-[75%] sm:max-w-full w-full mb-4 sm:mb-0" width="100" height="100" src="/404.svg" alt="not found"/>
        </div>
      </div>
    </div>
  )
}