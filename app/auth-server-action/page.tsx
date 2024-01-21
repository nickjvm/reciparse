'use server'

import React from 'react'
import { AuthForm } from './components/AuthForm'
import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'
import ContentContainer from '@/components/ui/templates/ContentContainer'

export default async function page() {
  const { data } = await readUserSession()

  if (data?.session) {
    return redirect('/recipes')
  }

  return (
    <ContentContainer>
      <div className="flex justify-center items-center h-full">
        <div className="w-96">
          <AuthForm />
        </div>
      </div>
    </ContentContainer>
  )
}
