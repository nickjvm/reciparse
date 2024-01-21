'use server'

import path from 'path'
import pick from 'lodash.pick'
import readUserSession from '@/lib/actions'
import createSupabaseServerClient from '@/lib/supabase/server'
import { DBRecipe } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import client from '@/lib/aws/config'
import { Inputs } from './schema'

export async function updateRecipe(id: string, _values: Inputs, fileData: FormData) {
  const values: DBRecipe = _values

  if (typeof values.ingredients === 'string') {
    values.ingredients = values.ingredients?.split('\n').map((v: string) => v.trim())
  }

  if (fileData) {
    const file = fileData.get('file') as File
    if (file) {
      const fileName = values.handle
      const fileType = file?.type

      const binaryFile = await file.arrayBuffer()
      const fileBuffer = Buffer.from(binaryFile)
      const extension = path.extname(file.name)

      const params = {
        Bucket: 'reciparse',
        Key: `${fileName}${extension}`,
        Body: fileBuffer,
        ContentType: fileType
      }
      await client.send(new PutObjectCommand(params))
      console.log('params.key', params.Key)
      values.image = `https://d2goxnc5qxbnja.cloudfront.net/${params.Key}`
    }
  }

  const supabase = await createSupabaseServerClient()

  if (values.collection_id === '-1') {
    const { data: collection, error } = await supabase.from('collections').insert({ name: values.collection_name }).select().single()
    if (collection) {
      values.collection_id = collection.id
    } else {
      throw new Error(error.message)
    }
  }

  const response = await supabase.from('recipes').update(pick(values, ['name', 'collection_id', 'prepTime', 'cookTime', 'totalTime', 'yield', 'is_public', 'ingredients', 'instructions', 'image'])).eq('id', id).select().single()

  if (!response.error) {
    revalidatePath(`/recipes/${response.data.id}`)
  }

  return response
}

export async function deleteRecipe(id: string) {
  const supabase = await createSupabaseServerClient()
  const { data } = await readUserSession()

  if (!data.session) {
    return {
      data: null,
      error: {
        message: 'Unauthorized',
      },
      count: null,
      status: 500,
      statusText: 'Unauthorized'
    }
  }

  const response = await supabase.from('recipes').delete().eq('id', id).eq('created_by', data.session.user.id)

  if (!response.error) {
    revalidatePath('/recipes')
    revalidatePath('/collections')
  }

  return response
}