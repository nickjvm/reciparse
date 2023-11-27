import classNames from 'classnames'

type Props = {
  icon?: React.ReactElement
  children?: React.ReactElement|string
  className?: string
  appearance?: 'primary'|'secondary'|'link'|'icon'
  size?: 'sm'|'md'|'lg'|'xl'
  block?: boolean
} & React.ComponentPropsWithoutRef<'button'>

export default function Button({ children, icon, className, appearance = 'primary', block, size = 'md', ...props }: Props) {
  const classList = classNames('inline-flex gap-2 items-center rounded-md', {
    'flex justify-center': block,
    'px-3 py-1.5 text-sm': size === 'md',
    'px-5 py-2 text-md': size === 'lg',
    'border border-gray-200': appearance === 'secondary',
    'underline': appearance === 'link',
    'transition justify-center  bg-brand-alt font-semibold leading-6 text-white shadow-sm hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-alt': appearance === 'primary'
  }, className)

  return (
    <button type="button" className={classList} {...props}>
      {icon}
      {children}
    </button>
  )
}