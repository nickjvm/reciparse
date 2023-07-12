'use client'
import { PrinterIcon } from '@heroicons/react/24/outline'

export default function Print() {
  return (
    <button
      className="print:hidden hidden sm:inline-flex ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded group hover:bg-slate-100 focus-visible:bg-slate-100"
      onClick={window.print}
    >
      <PrinterIcon className="w-5 group-hover:stroke-brand-alt group-hover:fill-white" />
      <span className="sr-only">Print</span>
    </button>
  )
}