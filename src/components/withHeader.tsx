import classnames from 'classnames';
import Header from './Header';

interface DefaultProps {
  withSearch?: boolean
  className?: string
}

export default function withHeader(Component: JSX.ElementType, { withSearch, className }: DefaultProps) {

  const WithHeader = (props: object) => (
    <div className={classnames('flex flex-col min-h-screen', className)}>
      <Header withBorder withSearch={withSearch} />
      <div className="pt-2 grow">
        <Component {...props} />
      </div>
    </div>
  );

  return WithHeader;
}