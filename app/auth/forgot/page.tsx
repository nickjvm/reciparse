'use server'

import React from 'react'
import readUserSession from '@/lib/actions'
import { redirect } from 'next/navigation'
import ContentContainer from '@/components/ui/templates/ContentContainer'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import Heading from '@/components/ui/atoms/Heading'

export default async function page() {
  const { data } = await readUserSession()

  if (data?.session) {
    return redirect('/recipes')
  }

  return (
    <ContentContainer className="max-w-96">
      <Heading>Forgot your password?</Heading>
      <ForgotPasswordForm />
    </ContentContainer>
  )
}
