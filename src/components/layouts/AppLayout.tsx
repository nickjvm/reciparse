'use client'

import { ReactNode, useEffect } from 'react'

import { useAuthContext } from '@/context/AuthContext'

import Header from '@/components/partials/Header'
import Footer from '@/components/partials/Footer'
import classNames from 'classnames'
import RecipeError from '../molecules/RecipeError'
import { useRouter } from 'next/navigation'

interface Props {
  fullWidth?: boolean
  withSearch: boolean
  children: ReactNode
  isPrivate?: boolean
  className?: string
}
export default function AppLayout({
  fullWidth,
  withSearch,
  children,
  isPrivate,
  className,
}: Props) {
  const { user, userLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!user && isPrivate && !userLoading) {
      router.push('/')
    }
  }, [user, isPrivate, userLoading])

  const renderChildren = () => {
    if (fullWidth) {
      return children
    } else {
      return (
        <div className="m-auto max-w-5xl px-4">
          {children}
        </div>
      )
    }
  }

  const unauthorized = isPrivate && !userLoading && !user && !sessionStorage.getItem('authdelay')
  return (
    <>
      <Header withBorder withSearch={withSearch} className={classNames(userLoading && 'invisible')} />
      <div className={classNames('grow', userLoading && 'invisible', className)}>
        {unauthorized
          ? <RecipeError
            errorTitle="Unauthorized"
            errorText="You must be logged in to access this page."
            actionText="Take me home"
            actionUrl="/"
            className="max-w-xl py-8 mx-auto"
          />
          : renderChildren()
        }
      </div>
      <Footer className={classNames(userLoading && 'invisible')} />
    </>
  )
}