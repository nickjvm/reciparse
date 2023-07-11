'use client'

import { useAuthContext } from '@/context/AuthContext'
import Link from 'next/link'
import AuthBtn from './AuthBtn'

export default function Footer() {
  const { user } = useAuthContext()
  return (
    <div className="text-white bg-gradient-to-br from-brand to-35% to-brand-alt p-3">
      <div className="mx-auto grid grid-cols-12 max-w-5xl items-start p-4 print:hidden md:px-6 gap-2">
        <div className="col-span-12 md:col-span-3 font-display text-3xl tracking-tight">
          reciparse
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2 md:col-start-7 lg:col-start-9 text-xs">
          <h4 className="font-semibold text-xs mt-2 mb-4">My Account</h4>
          <ul className="space-y-2">
            {!user && <li><AuthBtn /></li>}
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
          </ul>
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2 text-xs">
          <h4 className="font-semibold text-xs mt-2 mb-4">Other Info</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#">Privacy policy</Link>
            </li>
            <li>
              <Link target="_blank" href="https://github.com/nickjvm/reciparse">An open source project</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}