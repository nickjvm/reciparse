'use client'

import { useAuthContext } from '@/context/AuthContext'
import classNames from 'classnames'
import Link from 'next/link'

interface Props {
  className?: string
}
export default function Footer({ className }: Props) {
  const { user, setAuthType } = useAuthContext()
  return (
    <div className={classNames('print:hidden text-white bg-gradient-to-br from-brand to-35% to-brand-alt p-3', className)}>
      <div className="mx-auto grid grid-cols-12 max-w-5xl items-start p-4 print:hidden md:px-6 gap-2">
        <div className="col-span-12 md:col-span-3 font-display text-3xl tracking-tight">
          reciparse
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2 md:col-start-7 lg:col-start-9 text-xs">
          <h4 className="font-semibold text-xs mt-2 mb-4">Account</h4>
          <ul className="space-y-2">
            {!user && (
              <>
                <li><button onClick={() => setAuthType('signin')}>Sign In</button></li>
                <li><button onClick={() => setAuthType('signup')}>Sign Up</button></li>
              </>
            )}
            {user && (
              <>
                <li>
                  <Link href="/account">My Profile</Link>
                </li>
                <li>
                  <Link href="/account/favorites">My Favorites</Link>
                </li>
              </>
            )}
            <li><Link href="/info/bookmarklet">Bookmarklet</Link></li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2 text-xs">
          <h4 className="font-semibold text-xs mt-2 mb-4">Other Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/info/privacy">Privacy policy</Link>
            </li>
            <li>
              <Link href="/info/cookies">Cookie policy</Link>
            </li>
            <li>
              <Link href="/info/terms">Terms of use</Link>
            </li>
            <li>
              <Link href="/info/support">Support the developer</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}