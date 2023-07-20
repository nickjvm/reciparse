'use client'

import { useState } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import QuickSearch from '@/components/molecules/QuickSearch'
import AuthBtn from '@/components/molecules/AuthBtn'
import { OnNavigation } from '@/components/utils/OnNavigation'

interface Props {
  withSearch?: boolean
  withBorder?: boolean
  className?: string
}
export default function Header({
  withSearch = true,
  withBorder,
  className,
}: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <>
      <div />{/* empty div fixes issue with body not scrolling to top on router.push calls https://github.com/vercel/next.js/issues/28778#issuecomment-1615973918*/}
      <header className={classnames('sticky print:static top-0 z-10 isolate bg-white', withBorder && 'border-b-slate-100 print:shadow-none shadow-sm print:border-none border-b', className)}>
        <OnNavigation callback={() => setMobileMenuOpen(false)} />
        <nav className="mx-auto grid grid-cols-12 max-w-5xl items-center justify-between p-4 print:p-0 md:px-6 gap-2" aria-label="Global">
          <div className="flex md:flex-1 col-span-6 md:col-span-3 lg:col-span-2">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Reciparse</span>
              <Image width="100" height="100" className="h-8 max-w-[125px] w-auto" src="/logo.svg" alt="" />
            </Link>
          </div>
          <div className="flex md:gap-x-12 hidden md:block md:col-span-6 lg:col-span-8 col-start-4 print:hidden">
            <div className="w-full">
              {withSearch && <QuickSearch />}
            </div>
          </div>
          <div className="flex md:hidden col-start-10 col-span-3 justify-end print:hidden gap-2 whitespace-nowrap">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:flex md:flex-2 md:justify-end col-start-12 col-span-1 print:hidden">
            <div className="text-sm font-semibold leading-6 text-gray-900">
              <AuthBtn />
            </div>
          </div>
        </nav>
        <Dialog as="div" className="md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6">
                <div className="space-y-2 py-6">
                  <QuickSearch size="lg" />
                </div>
                <div className="text-sm font-semibold leading-6 text-gray-900">
                  <AuthBtn onClick={() => setMobileMenuOpen(false)}/>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  )
}
