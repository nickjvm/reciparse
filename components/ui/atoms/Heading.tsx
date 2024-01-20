import { cn } from '@/lib/utils'

type Props = {
  level?: 1|2|3|4|5|6
} & React.HTMLProps<HTMLHeadingElement>

export default function Heading({
  level = 1,
  className,
  children,
  ...props
}: Props) {
  const Tag = `h${level}` as unknown as React.ElementType
  let defaultClassList
  switch (level) {
    case 2: {
      defaultClassList = 'text-2xl font-display mb-3'
      break
    }
    case 3: {
      defaultClassList = 'text-xl font-display mb-2'
      break
    }
    case 4: {
      defaultClassList = 'text-lg mb-2'
      break
    }
    default: {
      defaultClassList = 'text-3xl font-medium font-display text-primary mb-4'
    }
  }
  return <Tag className={cn(defaultClassList, className)} {...props}>{children}</Tag>
}