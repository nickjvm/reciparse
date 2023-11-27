'use client'

import AppLayout from '@/components/layouts/AppLayout'
import { useParams, useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'

import request from '@/lib/api'
import { Recipe } from '@/types'

import AddEditForm, { FormValues } from '../../addEditForm'
import { serializeRecipeForm } from '../../helpers'
import Breadcrumbs from '@/components/molecules/Breadcrumbs'
import { useState } from 'react'

type EditRecipe = {
  recipeIngredient: string
  recipeInstructions: string
} & Omit<Recipe, 'recipeIngredient'|'recipeInstructions'>

export default function EditRecipe() {
  const { handle } = useParams()
  const router = useRouter()
  const [name, setName] = useState('')
  const onSubmit = async (values: FormValues) => {
    await request(`/api/recipes/custom/${handle}`, {
      method: 'PUT',
      multipart: true,
      body: serializeRecipeForm(values),
    })
    router.push(`/recipes/view/${handle}`)
  }

  return (
    <AppLayout isPrivate withSearch={false}>
      <ErrorBoundary fallback={<div>Error</div>} onError={console.log}>
        <main className="print:bg-white print:min-h-0 md:p-4 md:pb-6 print:p-0 max-w-5xl mx-auto">
          <div className="max-w-3xl m-auto">
            <Breadcrumbs className="mb-4" links={[
              { href: '/account', text: 'My account' },
              { href: '/recipes', text: 'My recipes' },
              { href: `/recipes/view/${handle}`, text: name },
              { text: 'Edit' },
            ]} />
            <div className="p-4 md:p-8 print:p-0 md:rounded-md ring-brand-alt md:ring-2 print:ring-0 print:shadow-none shadow-lg bg-white">
              <AddEditForm onSubmit={onSubmit} onLoad={(data: Recipe) => setName(data.name)} />
            </div>
          </div>
        </main>
      </ErrorBoundary>
    </AppLayout>
  )
}