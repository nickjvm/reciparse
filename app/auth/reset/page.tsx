'use server'

import React from 'react'
import ContentContainer from '@/components/ui/templates/ContentContainer'
import Heading from '@/components/ui/atoms/Heading'
import ResetPasswordForm from '../components/ResetPasswordForm'

export default async function page() {
  return (
    <ContentContainer className="max-w-96">
      <Heading>Reset your password</Heading>
      <ResetPasswordForm />
    </ContentContainer>
  )

}
