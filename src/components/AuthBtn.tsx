'use client'

import Link from 'next/link'
import { Popover } from '@headlessui/react'
import { HeartIcon, UserIcon, ArrowLeftOnRectangleIcon} from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'

import { useAuthContext } from '@/context/AuthContext'

interface Props {
  onClick?: () => void
}
function AuthBtn({ onClick }: Props) {
  const { user, setAuthType, actions } = useAuthContext()

  const handleClick = (authType: string) => () => {
    console.log('here')
    onClick?.()
    setAuthType(authType)
  }
  if (!user) {
    return (
      <div className="flex gap-3 items-center whitespace-nowrap">
        <button className="w-[50%] md:w-auto bg-white semibold px-3 ring-1 ring-gray-200 md:ring-transparent py-1.5 ring-gray-200 rounded hover:ring-1 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:ring-1 transition" onClick={handleClick('signin')}>Sign In</button>
        <button className="w-[50%] md:w-auto bg-brand-alt text-white semibold px-3 py-1.5 rounded hover:bg-brand focus-visible:bg-brand transition"  onClick={handleClick('signup')}>Sign Up</button>
      </div>
    )
  } else {
    return (
      <>
        <div className="hidden whitespace-nowrap md:block">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button className={classNames(
                  'transition flex items-center text-sm font-semibold leading-6 text-gray-900 hover:bg-slate-50 hover:ring-slate-200 hover:ring-1 focus-visible:bg-slate-50 py-1.5 px-2 -py-1.5 rounded',
                  open && 'ring-1 bg-slate-50, ring-slate-200'
                )}>
                  <span className="sr-only">My Account</span>
                  <span className="inline-block h-7 w-7 overflow-hidden rounded-full bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <ChevronDownIcon className="w-4 stroke-gray-500 ml-3"/>
                </Popover.Button>

                <Popover.Panel className="transition text-sm font-semibold leading-6 shadow absolute mt-2 bg-white right-0 rounded w-40 min-w-fit whitespace-nowrap">
                  <Link href="/account/favorites" className="block hover:bg-slate-50 px-3 py-2">
                    <HeartIcon className="w-5 inline-block mr-2" />
                    My Favorites
                  </Link>
                  <Link href="/account" className="transition block hover:bg-slate-50 px-3 py-2">
                    <UserIcon className="w-5 inline-block mr-2"/>
                    My Profile
                  </Link>
                  <button className="transition w-full text-left block hover:bg-slate-50 px-3 py-2" type="submit" onClick={actions.signOut}>
                    <ArrowLeftOnRectangleIcon className="w-5 inline-block mr-2"/>
                    Sign out
                  </button>
                </Popover.Panel>
              </>
            )}
          </Popover>
        </div>
        <div className="md:hidden space-y-1">
          <Link href="/account/favorites" className="block md:hover:bg-slate-100 py-2">
            <HeartIcon className="w-5 inline-block mr-2" />
            My Favorites
          </Link>
          <Link href="/account" className="block md:hover:bg-slate-100 py-2">
            <UserIcon className="w-5 inline-block mr-2"/>
            My Profile
          </Link>
          <button className="w-full text-left block md:hover:bg-slate-100 py-2" type="submit" onClick={actions.signOut}>
            <ArrowLeftOnRectangleIcon className="w-5 inline-block mr-2"/>
            Sign out
          </button>
        </div>
      </>
    )
  }
}

export default AuthBtn