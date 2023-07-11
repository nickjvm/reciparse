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

function toHoursAndMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  let str = ''
  if (hours) {
    str += hours + ' hour'
    if (hours !== 1) {
      str += 's'
    }
    str += ' '
  }
  if (minutes) {
    str += minutes + ' minute'
    if (minutes !== 1) {
      str += 's'
    }
  }
  return str
}

export default function Time(props: Props) {

  const prepTime = td.parse(props.prepTime || 'PT0M').minutes
  const cookTime = td.parse(props.cookTime || 'PT0M').minutes
  const totalTime = td.parse(props.totalTime || 'PT0M').minutes

  if (!totalTime) {
    return null
  }

  if (prepTime && cookTime) {
    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className={classnames('h-full inline-flex text-sm md:text-base ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded', { 'bg-slate-100': open })}>
              <ClockIcon className="w-5"/>
              <p className="max-w-[200px] truncate">{toHoursAndMinutes(totalTime)}</p>
            </Popover.Button>

            <Popover.Panel className="shadow-sm absolute z-10 bg-slate-100 px-3 py-2 mt-2 rounded w-16 min-w-fit whitespace-nowrap">
              <p className="text-sm">Prep time: {toHoursAndMinutes(prepTime)}</p>
              <p className="text-sm">Cook time: {toHoursAndMinutes(cookTime)}</p>
            </Popover.Panel>
          </>
        )}
      </Popover>
    )
  } else {
    return (
      <span className="inline-flex ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded">
        <ClockIcon className="w-5"/>
        {totalTime} minutes
      </span>
    )
  }
}