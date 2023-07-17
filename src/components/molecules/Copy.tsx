'use client'

import { CheckCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { KeyboardEvent, MouseEvent, useEffect, useState } from 'react'

interface Props {
  text: string
  preventBubble?: boolean
}

export default function Copy({ text, preventBubble }: Props) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 3000)
    }
  }, [copied])

  const onClick = async (e: MouseEvent|KeyboardEvent) => {
    if (e.type === 'keyup' && (e as KeyboardEvent).key !== 'Enter') {
      return
    }

    if (preventBubble) {
      e.preventDefault()
      e.stopPropagation()
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  if (!text) {
    return null
  }

  return (
    <>
      <span role="button" onKeyUp={onClick}tabIndex={0} data-disabled={copied} onClick={onClick} className="print:hidden data-[disabled=true]:pointer-events-none rounded-md px-1 py-0.5 border-slate-200 text-slate-500 border font-normal text-xs group hover:bg-slate-100 hover:text-slate-800 hover:border-slate-400 transition">
        {!copied && (
          <span className="flex gap-1">
            <ClipboardDocumentListIcon className="transition w-4 group-hover:text-brand group-hover:fill-white" />
            Copy
          </span>
        )}
        {copied && (
          <span className="flex gap-1">
            <CheckCircleIcon className="transition w-4 text-green-700" />
            Copied!
          </span>
        )}
      </span>
    </>
  )
}