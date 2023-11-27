import useAutosizeTextArea from '@/hooks/useAutosizeTextarea'
import { DetailedHTMLProps, TextareaHTMLAttributes, forwardRef, useRef } from 'react'

type Props = {
  autosize?: boolean
  minHeight?: number
} & DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>

type Ref = HTMLTextAreaElement

export const Textarea = forwardRef<Ref, Props>(({ minHeight, ...props }, ref) => {
  const inputRef = useRef<HTMLTextAreaElement|null>(null)
  useAutosizeTextArea(inputRef.current, `${props.value}`, minHeight)

  return <textarea ref={e => {
    if (typeof ref === 'function') {
      ref(e)
    }
    inputRef.current = e
  }} {...props} />
})

Textarea.displayName = 'Textarea'

export default Textarea