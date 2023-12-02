import useAutosizeTextArea from '@/hooks/useAutosizeTextarea'
import classNames from 'classnames'
import { DetailedHTMLProps, TextareaHTMLAttributes, forwardRef, useRef } from 'react'

type Props = {
  autosize?: boolean
  minHeight?: number
} & DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>

type Ref = HTMLTextAreaElement

export const Textarea = forwardRef<Ref, Props>(({ minHeight, className, ...props }, ref) => {
  const inputRef = useRef<HTMLTextAreaElement|null>(null)
  useAutosizeTextArea(inputRef.current, `${props.value}`, minHeight)

  return <textarea ref={e => {
    if (typeof ref === 'function') {
      ref(e)
    }
    inputRef.current = e
  }} {...props} className={classNames('overflow-hidden', className)} />
})

Textarea.displayName = 'Textarea'

export default Textarea