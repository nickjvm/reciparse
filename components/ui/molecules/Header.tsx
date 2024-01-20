'use client'

import * as Dialog from '@radix-ui/react-dialog'
import SignOut from '@/app/auth-server-action/components/SignOut'
import { Session } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import MenuDropdown from './MenuDropdown'
import ParseRecipeDialog from './ParseRecipeDialog'
import { Button } from '../button'
import { CaretDownIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { usePathname, useSearchParams } from 'next/navigation'
import { useDidUpdateEffect } from '@/lib/hooks/useDidUpdateEffect'

type Props = {
  session?: Session|null
}
export default function Header({ session }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hiddenState, setHiddenState] = useState<'partial'|'complete'|null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  useDidUpdateEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname, searchParams])

  useEffect(() => {
    const partialThreshold = 100
    const completeThreshold = 300
    let lastScrollY = global?.window?.scrollY
    const onScroll = () => {
      if (window.scrollY < lastScrollY) {
        if (window.scrollY < partialThreshold) {
          setHiddenState(null)
        } else {
          setHiddenState('partial')
        }
      } else {
        if (window.scrollY > completeThreshold) {
          setHiddenState('complete')
        } else if (window.scrollY > partialThreshold) {
          setHiddenState('partial')
        }
      }
      lastScrollY = window.scrollY
    }

    onScroll()
    global.window.addEventListener('scroll', onScroll)

    return () => {
      global.window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className={cn(
      'print:hidden px-4 border-b border-b-slate-200 sticky top-0 bg-white z-10 transition-transform',
      hiddenState === 'partial' && '-translate-y-[36px]',
      hiddenState === 'complete' && '-translate-y-[100%]'
    )}>
      {session && (
        <div className="bg-slate-50 hidden md:block">
          <div className="max-w-5xl m-auto flex items-center justify-end gap-3 text-sm">
            <Link href="/account" className="p-2">My Account</Link>
            <SignOut />
          </div>
        </div>
      )}
      <div className="max-w-5xl m-auto flex items-center gap-3">
        <div className="flex items-center gap-6 grow">
          <Link href="/" className="py-3 md:py-0">
            <span className="sr-only">Reciparse.com</span>
            <Image width="100" height="100" className="h-8 max-w-[125px] w-auto" src="/logo.svg" alt="" />
          </Link>
          <div className="hidden md:flex items-center">
            {session && (
              <>
                <MenuDropdown
                  label={<button className="data-[state=open]:bg-slate-50 cursor-pointer inline-flex gap-1 items-center py-6 px-4 hover:bg-slate-50">My stuff <CaretDownIcon className="w-5 h-5" /></button>}
                  items={[
                    <Link key="recipes" href="/recipes" className="py-2 px-4 hover:bg-slate-50 block focus-visible:outline-0">Recipes</Link>,
                    <Link key="collections" href="/collections" className="py-2 px-4 hover:bg-slate-50 block focus-visible:outline-0">Collections</Link>,
                  ]}
                />
                <Link href="/recipes/add" className="py-6 px-4 border-b border-b-transparent hover:bg-slate-50 hover:border-b-primary -mb-[1px]">Add a recipe</Link>
              </>
            )}
            <ParseRecipeDialog trigger={<button className="py-6 px-4 border-b border-b-transparent hover:bg-slate-50 hover:border-b-primary -mb-[1px]">Parse a recipe</button>} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {session ? null : <><Link href="/auth-server-action"><Button variant="outline">Sign In</Button></Link><Button>Sign Up</Button></>}
        </div>
        {session && (
          <div className="flex md:hidden col-start-10 col-span-3 justify-end print:hidden gap-2 whitespace-nowrap">
            <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} >
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed bg-slate-900/70 w-full h-full top-0 left-0 z-20" />
                <Dialog.Content onCloseAutoFocus={(e) => e.preventDefault()} className={cn(
                  'fixed right-0 top-0 h-full overflow-auto z-50 w-full max-w-96',
                  'bg-white dark:bg-gray-800 py-4 flex flex-col',
                )}>
                  <div className="px-4 flex justify-between items-center mb-4">
                    <div className="font-display text-xl text-primary">reciparse</div>
                    <Dialog.Close asChild>
                      <button className="" aria-label="Close">
                        <Cross2Icon className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="grow">
                    {session && (
                      <>
                        <Link key="recipes" href="/recipes" className="py-2 px-4 hover:bg-slate-50 block focus-visible:outline-0">Recipes</Link>
                        <Link key="collections" href="/collections" className="py-2 px-4 hover:bg-slate-50 block focus-visible:outline-0">Collections</Link>
                        <Link href="/recipes/add" className="py-2 px-4 hover:bg-slate-50 block focus-visible:outline-0">Add a recipe</Link>
                      </>
                    )}
                    <ParseRecipeDialog trigger={<button className="py-2 px-4 hover:bg-slate-50 block focus-visible:outline-0">Parse a recipe</button>} />
                  </div>
                  <div>
                    <SignOut className="block px-4 text-left" />
                  </div>


                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        )}

      </div>
    </div>
  )
}