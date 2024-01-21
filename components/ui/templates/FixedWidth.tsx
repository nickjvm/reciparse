import { cn } from '@/lib/utils'

type Props = React.AllHTMLAttributes<HTMLDivElement>

export default function FixedWidth({ className, children }: Props) {
  return (
    <div className={cn('grow pt-4 pb-8 print:pt-0 print:pb-0 px-4 lg:px-0 mx-auto max-w-5xl', className)}>
      {children}
    </div>
  )
}