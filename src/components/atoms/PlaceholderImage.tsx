import { PhotoIcon } from '@heroicons/react/24/outline'

export default function PlaceholderImage({ text }: { text?: string }) {
  return (
    <div className="w-full rounded aspect-square bg-slate-100 border border-slate-200 flex flex-col items-center justify-center">
      <PhotoIcon className="w-10 h-10 text-slate-300"/>
      {text && <div className="text-xs text-center text-slate-500 block">{text}</div>}
    </div>
  )
}