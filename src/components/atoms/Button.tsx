import classNames from 'classnames'
import Link, { LinkProps } from 'next/link'

type CommonProps = {
  icon?: React.ReactElement
  children?: React.ReactElement|string
  className?: string
  appearance?: 'primary'|'secondary'|'link'|'icon'
  size?: 'sm'|'md'|'lg'|'xl'
  block?: boolean
  href?: string
  as?: 'button' | 'link'
}
type ButtonProps = CommonProps & React.ComponentPropsWithoutRef<'button'>
type AnchorProps = CommonProps & LinkProps

export default function Button({ as, children, icon, className, appearance = 'primary', block, size = 'md', ...props }: ButtonProps|AnchorProps) {
  const classList = classNames('inline-flex gap-2 items-center rounded-md', {
    'flex justify-center': block,
    'px-3 py-1.5 text-sm': size === 'md',
    'px-5 py-2 text-md': size === 'lg',
    'border border-gray-200': appearance === 'secondary',
    'underline': appearance === 'link',
    'transition justify-center  bg-brand-alt font-semibold leading-6 text-white shadow-sm hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-alt': appearance === 'primary'
  }, className)

  if (as === 'link') {
    return (
      <Link className={classList} {...props as AnchorProps}>
        {icon}
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={classList} {...props as ButtonProps}>
      {icon}
      {children}
    </button>
  )
}