'use client'
import { Popover } from '@headlessui/react'
import { ClockIcon } from '@heroicons/react/24/outline'
import * as td from 'tinyduration'
import classnames from 'classnames'

interface Props {
  prepTime?: string
  cookTime?: string
  totalTime?: string
}
export default function Time(props: Props) {
  const prepTime = td.parse(props.prepTime || '0').minutes
  const cookTime = td.parse(props.cookTime || '0').minutes
  const totalTime = td.parse(props.totalTime || '0').minutes

  if (!totalTime) {
    return null
  }

  if (prepTime && cookTime) {
    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className={classnames('inline-flex ring-2 ring-brand focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded', { 'bg-slate-100': open })}>
              <ClockIcon className="w-5"/>
              {totalTime} minutes
            </Popover.Button>

            <Popover.Panel className="shadow-sm absolute z-10 bg-slate-100 px-3 py-2 mt-2 rounded w-16 min-w-fit whitespace-nowrap">
              <p className="text-sm">Prep time: {prepTime} minutes</p>
              <p className="text-sm">Cook time: {cookTime} minutes</p>
            </Popover.Panel>
          </>
        )}
      </Popover>
    )
  } else {
    return (
      <span className="inline-flex ring-2 ring-brand focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded">
        <ClockIcon className="w-5"/>
        {totalTime} minutes
      </span>
    )
  }
}