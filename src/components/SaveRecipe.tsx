'use client'
import { MouseEvent, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import { clientRequest } from "@/lib/api";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Props {
  id: number
  saved: boolean
}
export default function SaveRecipe({ id, saved: _saved }: Props) {
  const { user } = useAuthContext()
  const router = useRouter()
  const [saved, setSaved] = useState<boolean>(_saved)
  const handleClick = async (e: MouseEvent) => {
    e.preventDefault()
    try {
      await clientRequest('/api/recipes/save', { method: 'POST', body: JSON.stringify({ id, save: !saved })})
      setSaved(!saved)

      router.refresh()
    } catch (e) {
      console.log(e)
    }
  }
  if (!user) {
    return null
  }
  return (
    <button className="inline-flex ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded" onClick={handleClick}>
      {!saved && <HeartIcon className="w-6 stroke-brand" />}
      {saved && <HeartIconFilled className="w-6 fill-brand-alt" />}
    </button>
  )
}