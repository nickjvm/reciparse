import { PhotoIcon } from '@heroicons/react/24/outline'

export default function PlaceholderImage() {
  return (
    <div className="w-full rounded aspect-square bg-slate-100 border border-slate-200 flex items-center justify-center">
      <PhotoIcon className="w-10 h-10 text-slate-300"/>
    </div>
  )
}