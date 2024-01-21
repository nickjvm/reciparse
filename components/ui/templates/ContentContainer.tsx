import FixedWidth from './FixedWidth'
import FullWidth from './FullWidth'

type Props = {
  fullWidth?: boolean
} & React.AllHTMLAttributes<HTMLDivElement>

export default function ContentContainer({ fullWidth, ...props }: Props) {
  if (fullWidth) {
    return <FullWidth {...props} />
  }
  return <FixedWidth {...props} />
}
