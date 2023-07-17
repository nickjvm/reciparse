import classNames from 'classnames'
import Header from '@/components/partials/Header'

interface DefaultProps {
  withSearch?: boolean
  className?: string
  fullWidth?: boolean
}

export default function withHeader(Component: JSX.ElementType, { withSearch, className, fullWidth }: DefaultProps) {

  const container = (props: object) => {
    if (fullWidth) {
      return (
        <div className="py-4 md:py-8">
          <Component {...props} />
        </div>
      )
    } else {
      return (
        <div className="m-auto max-w-5xl p-4 md:p-8">
          <Component {...props} />
        </div>
      )
    }
  }

  const WithHeader = (props: object) => (
    <div className={classNames('flex-grow', className)}>
      <Header withBorder withSearch={withSearch} />
      <div className="pt-2 grow">
        {container(props)}
      </div>
    </div>
  )

  return WithHeader
}