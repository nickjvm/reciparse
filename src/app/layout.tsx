
import { Open_Sans, Yeseva_One } from 'next/font/google'
import classNames from 'classnames'
import { cookies } from 'next/headers'

import { AuthContextProvider } from '@/context/AuthContext'

import './globals.css'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'

import CookieBanner from '@/components/CookieBanner'
import Footer from '@/components/Footer'
import NotificationProvider from '@/context/NotificationContext'
import GA4 from '@/components/GA4'

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-opensans',
})
const yesevaOne = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-yesevaone',
})


export const metadata = {
  title: 'Reciparse.com',
  description: 'Ditch the endless scrolling, stories, ads and videos. Get exactly what you need: the recipe.',
  openGraph: {
    images: 'og-image.png'
  }
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en" className={classNames(openSans.className, openSans.variable, yesevaOne.variable)}>
      <link rel="icon" type="image/png" href="/favicon.png" />
      <GA4 />
      <body>
        <NotificationProvider>
          <AuthContextProvider user={session?.user || null}>
            <div className="min-h-screen flex flex-col">
              <div className="flex-grow flex flex-col ">
                {children}
              </div>
              <Footer />
              {!cookies().get('cookie_consent') && <CookieBanner />}
            </div>
          </AuthContextProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
