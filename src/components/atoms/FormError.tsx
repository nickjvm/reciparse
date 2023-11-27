type Props = {
  message?: string
}

export default function FormError({ message }: Props) {
  if (!message) {
    return
  }
  return <span className="text-xs text-red-600">{message}</span>
}