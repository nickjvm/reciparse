'use client'

import AppLayout from '@/components/layouts/AppLayout'
import { useParams, useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'

import request from '@/lib/api'
import { Recipe } from '@/types'

import AddEditForm, { FormValues } from '../../addEditForm'
import { serializeRecipeForm } from '../../helpers'

type EditRecipe = {
  recipeIngredient: string
  recipeInstructions: string
} & Omit<Recipe, 'recipeIngredient'|'recipeInstructions'>

export default function EditRecipe() {
  const { handle } = useParams()
  const router = useRouter()

  const onSubmit = async (values: FormValues) => {
    await request(`/api/recipes/custom/${handle}`, {
      method: 'PUT',
      multipart: true,
      body: serializeRecipeForm(values),
    })
    router.push(`/recipes/view/${handle}`)
  }

  return (
    <AppLayout withSearch>
      <ErrorBoundary fallback={<div>Error</div>} onError={console.log}>
        <main className="print:bg-white print:min-h-0 md:p-4 md:pb-6 print:p-0 max-w-5xl mx-auto">
          <div className="m-auto max-w-3xl p-4 md:p-8 print:p-0 md:rounded-md ring-brand-alt md:ring-2 print:ring-0 print:shadow-none shadow-lg bg-white">
            <AddEditForm onSubmit={onSubmit} />
          </div>
        </main>
      </ErrorBoundary>
    </AppLayout>
  )
}