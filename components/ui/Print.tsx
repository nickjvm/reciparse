'use client'
import { PrinterIcon } from '@heroicons/react/24/outline'
import { Button } from './button'

export default function Print() {
  return (
    <Button
      className="print:hidden hidden sm:inline-flex space-x-2"
      onClick={global.window?.print}
    >
      <PrinterIcon className="w-5 group-hover:stroke-brand-alt group-hover:fill-white" />
      <span>Print</span>
    </Button>
  )
}