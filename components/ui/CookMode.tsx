'use client'
import { useCallback, useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { cn } from '@/lib/utils'

interface Props {
  checked?: boolean
}

export default function CookMode({ checked }: Props) {
  const [enabled, setEnabled] = useState(checked)
  const [lock, setLock] = useState<WakeLockSentinel>()

  const requestWakeLock = async () => {
    return window.navigator.wakeLock.request('screen')
  }

  const handleVisibilityChange = useCallback(async () => {
    if (enabled && lock && document.visibilityState === 'visible') {
      await requestWakeLock()
    }
  }, [enabled, lock])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleVisibilityChange])

  const handleChange = async (active: boolean) => {
    setEnabled(active)
    if (active) {
      try {
        setLock(await requestWakeLock())
      } catch (err) {
        console.log('Wake Lock error: ', err)
      }
    } else if (lock) {
      await lock.release()
    }
  }

  if (global.window && !('wakeLock' in window.navigator)) {
    return null
  }

  return (
    <div className="print:hidden flex gap-2 items-center w-full">
      <div>
        <Switch
          checked={checked}
          onChange={handleChange}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2',
            enabled  ? 'bg-brand' : 'bg-slate-200'
          )}>
          <span className="sr-only">Enable cooking mode</span>
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>
      <p>
        <strong>Cook Mode</strong>
        {' '}
        <span className="block sm:inline text-sm text-slate-500">Prevent your screen from going dark</span>
      </p>
    </div>
  )
}