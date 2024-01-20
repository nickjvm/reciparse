import React from 'react'

import { NextPage } from '@/lib/types'
import createSupabaseServerClient from '@/lib/supabase/server'
import { getRecipeIngredients } from '@/app/parse/actions'
import readUserSession from '@/lib/actions'

import FullRecipe from '@/components/ui/molecules/FullRecipe'
import AppLayout from '@/components/ui/templates/AppLayout'

export default async function Page({ params }: NextPage) {
  const supabase = await createSupabaseServerClient()

  const { data: sessionData } = await readUserSession()
  const { data, error } = await supabase.from('recipes').select().eq('id', params.handle).single()

  if (error) {
    // TODO: is_public = false UI error handling
    console.log(error)
    throw new Error('something went wrong')
  }

  const recipe = {
    ...data,
    ingredients: await getRecipeIngredients(data.ingredients),
  }

  if (data?.id && sessionData?.session) {
    await supabase.from('history').upsert({
      user_id: sessionData.session.user.id,
      recipe_id: data.id
    }, {
      onConflict: 'user_id, recipe_id'
    })
  }

  return (
    <AppLayout session={sessionData?.session}>
      <FullRecipe recipe={recipe} user={sessionData?.session?.user} />
    </AppLayout>
  )
}
