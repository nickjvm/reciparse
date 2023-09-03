import { Open_Sans, Yeseva_One } from 'next/font/google'
import classNames from 'classnames'
import { cookies } from 'next/headers'
import { ErrorBoundary } from 'react-error-boundary'

import { AuthContextProvider } from '@/context/AuthContext'

import './globals.css'

import CookieBanner from '@/components/molecules/CookieBanner'
import NotificationProvider from '@/context/NotificationContext'
import GA4 from '@/components/atoms/GA4'
import Fallback from '@/components/molecules/ErrorFallback'
import LogRocketInit from '@/components/atoms/LogRocket'

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

export default async function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={classNames(openSans.className, openSans.variable, yesevaOne.variable)}>
      <link rel="icon" type="image/png" href="/favicon.png" />
      <GA4 />
      <body>
        <LogRocketInit />
        <ErrorBoundary FallbackComponent={Fallback}>
          <NotificationProvider>
            <AuthContextProvider user={null}>
              <div className="min-h-screen flex flex-col">
                <div className="flex-grow flex flex-col ">
                  {children}
                </div>
                {!cookies().get('cookie_consent') && <CookieBanner />}
              </div>
            </AuthContextProvider>
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
