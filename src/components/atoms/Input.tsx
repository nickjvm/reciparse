import classNames from 'classnames'
import { forwardRef, useEffect, useId, useRef, useState } from 'react'

type Props = {
  label?: string
  animate?: boolean
  error?: string|boolean
} & React.ComponentPropsWithoutRef<'input'>

type Ref = HTMLInputElement

const ForwardRefInput = forwardRef<Ref, Props>(({ label, animate = true, error, ...props}, ref) => {
  const [filled, setFilled] = useState<boolean>(animate ? !!props.value : true)
  const [focused, setFocused] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement|null>()
  const fallbackId = useId()
  const id = props.id || fallbackId

  const onFocus = () => {
    setFocused(true)
  }
  const onBlur = () => {
    setFocused(false)
  }

  useEffect(() => {
    setFilled(animate ? !!inputRef.current?.value : true)
  }, [inputRef.current, animate])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(e)
    if (animate) {
      if (e.target.value) {
        setFilled(true)
      } else {
        setFilled(false)
      }
    }
  }

  const labelClassList = classNames('absolute transition-all pl-3 font-sans pointer-events-none',
    (focused || filled)
      ? 'text-xs top-[0px] pt-1'
      : 'text-md top-[50%] translate-y-[-50%] ',
    error ? 'text-red-600' : 'text-slate-500'
  )

  const wrapperClassList = classNames('transition-shadow relative w-full rounded-md border border-gray-200',
    focused && 'ring-1 ring-brand',
    focused || filled ? 'pt-5' : 'py-2',
    error && 'ring-1 ring-red-600'
  )

  const inputClassList = classNames('leading-2 focus:ring-0 rounded-md px-3 py-1 w-full border-0 placeholder:text-gray-300',
    focused || filled ? 'pt-0 pb-1' : 'py-1'
  )
  return (
    <div className={wrapperClassList}>
      {label && <label className={labelClassList} htmlFor={id}>{label}</label>}
      <input ref={(e) => {
        if (typeof ref === 'function') {
          ref(e)
        }
        inputRef.current = e
      }} className={inputClassList} {...props} onFocus={onFocus} onBlur={onBlur} onChange={onChange} id={id} />
    </div>
  )
})

ForwardRefInput.displayName = 'Input'

export default ForwardRefInput