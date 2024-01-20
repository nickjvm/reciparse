import Header from '../molecules/Header'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import { Session } from '@supabase/supabase-js'

type Props = {
  className?: string,
  session: Session|null
} & PropsWithChildren

export default async function AppLayout({ className, children, session }: Props) {
  return (
    <div className="flex flex-col justify-stretch min-h-screen">
      <Header session={session} />
      <div className={cn('grow pt-4 pb-8 print:pt-0 print:pb-0 px-4 lg:px-0 mx-auto max-w-5xl', className)}>
        {children}
      </div>
      <div className="bg-primary p-4 text-white print:hidden">
        <div className="max-w-5xl m-auto grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7">
            <span className="text-3xl font-display text-white">reciparse</span>
          </div>
          <div className="col-span-12 md:col-span-5 grid grid-cols-2">
            <div className="col-span-1">
              <h4 className="font-semibold mt-2 mb-4">Account</h4>
              <ul className="space-y-2">
                {!session ? (
                  <>
                    <li><Link href="/auth-server-action#signin">Sign In</Link></li>
                    <li><Link href="/auth-server-action#registeer">Register</Link></li>
                  </>
                ) : (<>
                  <li>
                    <Link href="/account">My Profile</Link>
                  </li>
                  <li>
                    <Link href="/account/favorites">My Favorites</Link>
                  </li>
                </>)}
                <li><Link href="/info/bookmarklet">Bookmarklet</Link></li>
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="font-semibold mt-2 mb-4">Other Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/info/support">Support the developer</Link>
                </li>
                <li>
                  <Link href="/info/privacy">Privacy policy</Link>
                </li>
                <li>
                  <Link href="/info/cookies">Cookie policy</Link>
                </li>
                <li>
                  <Link href="/info/terms">Terms of use</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}