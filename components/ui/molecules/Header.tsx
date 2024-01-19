'use client'

import SignOut from '@/app/auth-server-action/components/SignOut'
import { Session } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import MenuDropdown from './MenuDropdown'
import ParseRecipeDialog from './ParseRecipeDialog'
import { Button } from '../button'
import { CaretDownIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  session: Session|null
}
export default function Header({ session }: Props) {
  const [hiddenState, setHiddenState] = useState<'partial'|'complete'|null>(null)
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
      </div>
    </div>
  )
}