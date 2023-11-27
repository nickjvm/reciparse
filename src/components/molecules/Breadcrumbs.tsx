import classNames from 'classnames'
import Link from 'next/link'

type Link = {
  href?: string
  text: string
}
type Props = {
  className?: string
  links: Link[]
}
export default function Breadcrumbs(props: Props) {
  return <ol className={classNames('flex items-center gap-2', props.className)}>
    {props.links.map((link, i) => (
      <li key={i} className="[&:not(:last-child)]:after:content-['›'] inline-flex gap-2 text-slate-500 text-sm">
        {link.href && <Link className="text-brand-alt hover:text-brand hover:underline" href={link.href}>{link.text}</Link>}
        {!link.href && <span className="inline-flex gap-2 text-slate-500 text-sm">{link.text}</span>}
      </li>
    ))}
  </ol>
}