'use client'
import { MouseEvent, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import { clientRequest } from "@/lib/api";

interface Props {
  id: string
  saved: boolean
}
export default function SaveRecipe({ id, saved: _saved }: Props) {
  const [saved, setSaved] = useState<boolean>(_saved)
  const handleClick = async (e: MouseEvent) => {
    e.preventDefault()
    try {
      await clientRequest('/api/recipe/save', { method: 'POST', body: JSON.stringify({ id, save: !saved })})
      setSaved(!saved)
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <button className="inline-flex ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded" onClick={handleClick}>
      {id}
      {!saved && <HeartIcon className="w-6 stroke-brand" />}
      {saved && <HeartIconFilled className="w-6 fill-brand-alt" />}
    </button>
  )
}