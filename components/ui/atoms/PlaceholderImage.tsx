import { PhotoIcon } from '@heroicons/react/24/outline'

type Props = {
  text?: string
}

export default function PlaceholderImage({ text }: Props) {
  return (
    <div className="w-full rounded aspect-square bg-slate-100 border border-slate-200 flex items-center justify-center flex-col">
      <PhotoIcon className="w-10 h-10 text-slate-300"/>
      {text && <span className="text-slate-500 text-sm text-center">{text}</span>}
    </div>
  )
}