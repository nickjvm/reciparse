import Image from 'next/image'
import Link from 'next/link'
import { decode } from 'html-entities'

import PlaceholderImage from './PlaceholderImage'
import { cn } from '@/lib/utils'

interface Props {
  url: string;
  image?: string|null;
  title: string;
  subtitle?: string;
  className?: string
  loading?: boolean
}

export default function Card({ url, image, title, subtitle, className, loading }: Props) {
  if (loading) {
    return (
      <div className={cn('animate-pulse self-stretch w-[33vw] min-w-[33vw] md:w-[19vw] md:min-w-[19vw] xl:w-auto xl:min-w-0 max-w-1/8 shrink-0 flex-1 flex-grow', className)}>
        <div className="rounded block md:py-3 md:px-6 md:-mx-3 h-full">
          <div className="bg-gray-200 w-full rounded-lg aspect-square mb-3"></div>
          <div className="bg-gray-200 w-full rounded-full mb-2 h-4"></div>
          <div className="bg-gray-200 w-[90%] rounded-full mb-2 h-4"></div>
          <div className="bg-gray-200 w-[80%] rounded-full h-2"></div>
        </div>
      </div>
    )
  } else {
    return (
      <div className={cn('self-stretch flex-1 flex-grow flex-shrink', className)}>
        <Link
          href={url}
          className="flex flex-col md:hover:bg-white md:hover:ring-brand transition ring-2 ring-transparent rounded md:p-3 md:-mx-1.5 h-full">
          <div className="w-full rounded aspect-square mb-3 relative">
            {image && <Image alt={title} src={image} width="200" height="200" className="w-full aspect-square" style={{ objectFit: 'cover' }} />}
            {!image && <PlaceholderImage />}
          </div>
          <p className="leading-tight text-sm line-clamp-2 mb-1">{decode(title)}</p>
          {subtitle && <p className="mt-auto text-xs text-slate-500 line-clamp-1">{subtitle}</p>}
        </Link>
      </div>
    )
  }
}