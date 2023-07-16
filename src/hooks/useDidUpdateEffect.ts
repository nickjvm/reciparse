import { useEffect, useRef } from 'react'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function useDidUpdateEffect(fn: () => void, inputs: any[]) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) {
      return fn()
    }

    didMountRef.current = true
  }, inputs)
}