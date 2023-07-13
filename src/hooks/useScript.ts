import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface Attrs {
  innerText?: string
  id?: string
  type?: string
  src?: string
}
export default function useScript(attrs: Attrs) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const script = document.createElement('script')
    if (attrs.innerText) {
      script.innerText = attrs.innerText
    }
    if (attrs.src) {
      script.src = attrs.src
    }
    script.id = attrs.id || ''
    script.type = attrs.type || 'text/javascript'
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [pathname, searchParams, attrs.innerText, attrs.src, attrs.id, attrs.type])
}