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

function toHoursAndMinutes(duration: td.Duration|undefined): string {
  if (!duration) {
    return ''
  }

  let { hours = 0, minutes = 0 } = duration
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60)
    minutes = minutes % 60
  }

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

interface Times {
  prepTime?: td.Duration|undefined
  cookTime?: td.Duration|undefined
  totalTime?: td.Duration|undefined
}

type TimeKey = 'prepTime'|'totalTime'|'cookTime'
export default function Time(props: Props) {
  const times: Times = {};
  ['prepTime', 'cookTime', 'totalTime'].forEach((dur: string) => {
    let time: td.Duration|undefined = undefined
    try {
      time = td.parse(props[dur as TimeKey] || 'PT0M')
    } catch (e) {
      //
    } finally {
      times[dur as TimeKey] = time
    }
  })

  if (!times.totalTime?.hours && !times.totalTime?.minutes) {
    return null
  }

  if (times.prepTime && times.cookTime) {
    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className={classnames('h-full inline-flex text-sm md:text-base ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded hover:bg-slate-100 focus-visible:bg-slate-100', { 'bg-slate-100': open })}>
              <ClockIcon className="w-5"/>
              <p className="max-w-[200px] truncate">{toHoursAndMinutes(times.totalTime)}</p>
            </Popover.Button>

            <Popover.Panel className="shadow-sm absolute z-10 bg-slate-100 px-3 py-2 mt-2 rounded w-16 min-w-fit whitespace-nowrap">
              {(!!times.prepTime?.hours || !!times.prepTime?.minutes) && <p className="text-sm">Prep time: {toHoursAndMinutes(times.prepTime)}</p>}
              {(!!times.cookTime?.hours || !!times.cookTime?.minutes) && <p className="text-sm">Cook time: {toHoursAndMinutes(times.cookTime)}</p>}
            </Popover.Panel>
          </>
        )}
      </Popover>
    )
  } else {
    return (
      <span className="inline-flex ring-2 ring-brand-alt focus-visible:outline-0 gap-1 items-center px-2 py-1 rounded">
        <ClockIcon className="w-5"/>
        {toHoursAndMinutes(times.totalTime)}
      </span>
    )
  }
}
