'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getCookie, setCookie } from 'cookies-next'

export default function CookieBanner() {
  const [accept, setAccept] = useState(getCookie('cookie_consent'))
  const onClick = () => {
    setCookie('cookie_consent', 1)
    setAccept('1')
  }

  if (accept) {
    return null
  }

  return (
    <div className="rounded-lg p-3 ring-2 ring-brand-alt fixed bottom-2 -translate-x-[50%] left-[50%] w-[90%] max-w-full md:max-w-2xl bg-white shadow">
      <div className="grid grid-cols-12 gap-4 items-center mx-auto max-w-4xl">
        <div className="col-span-12 sm:col-span-9 text-sm">
          This website collects cookies to deliver better user experience. For more information, read our{' '}
          <Link className="underline whitespace-nowrap" href="/info/cookies">cookie policy</Link> and our <Link className="underline whitespace-nowrap" href="/info/privacy">privacy policy</Link>.
        </div>
        <div className="col-span-12 sm:col-span-3 text-center">
          <button onClick={onClick} className="block w-full md:w-auto mx-auto rounded font-semibold bg-brand-alt hover:bg-brand focus-visible:bg-brand transition p-2 px-6 shadow text-white">Accept</button>
        </div>
      </div>
    </div>
  )
}