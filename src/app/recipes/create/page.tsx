'use client'

import Error from '@/app/error'
import AppLayout from '@/components/layouts/AppLayout'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import AddEditForm, { FormValues } from '../addEditForm'
import { useRouter } from 'next/navigation'
import request from '@/lib/api'
import { serializeRecipeForm } from '../helpers'
import Breadcrumbs from '@/components/molecules/Breadcrumbs'


export default function CreateRecipe() {
  const router = useRouter()

  const onSubmit = async (values: FormValues) => {
    const { data } = await request('/api/recipes/custom/', {
      method: 'POST',
      multipart: true,
      body: serializeRecipeForm(values),
    })
    router.push(`/recipes/view/${data.handle}`)
  }

  return (
    <AppLayout isPrivate withSearch={false}>
      <ErrorBoundary errorComponent={Error}>
        <main className="print:bg-white print:min-h-0 md:p-4 md:pb-6 print:p-0 max-w-5xl mx-auto">
          <div className="max-w-3xl m-auto">
            <Breadcrumbs className="mb-4" links={[{ href: '/account', text: 'My account' }, { href: '/recipes', text: 'My recipes' }, { text: 'Create a recipe' }]} />
            <div className="p-4 md:p-8 print:p-0 md:rounded-md ring-brand-alt md:ring-2 print:ring-0 print:shadow-none shadow-lg bg-white">
              <AddEditForm onSubmit={onSubmit} />
            </div>
          </div>
        </main>
      </ErrorBoundary>
    </AppLayout>
  )
}