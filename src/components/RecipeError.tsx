import Image from 'next/image'
import Link from 'next/link'

interface Props {
  actionUrl?: string
  actionText?: string
  errorText?: string
}
export default function RecipeError({ actionUrl, actionText, errorText }: Props) {
  return (
    <div className="m-auto max-w-3xl mt-12">
      <div className="grid grid-cols-12 items-center">
        <div className="col-span-7">
          <h2 className="text-brand-alt font-display text-4xl mb-4">Shoot.</h2>
          <p className="text-xl">{errorText || 'We tried our best, but couldn\'t find what you were looking for.'}</p>
          {actionUrl && actionText && (
            <Link className="font-semibold inline-block mt-5 py-3 px-4 text-md bg-brand-alt hover:bg-brand focus-visible:bg-brand text-white transition rounded " href={actionUrl}>{actionText}</Link>
          )}
        </div>
        <div className="col-span-4 col-start-9">
          <Image className="w-full" width="100" height="100" src="/404.svg" alt="not found"/>
        </div>
      </div>
    </div>
  )
}