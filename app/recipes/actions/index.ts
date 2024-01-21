'use server'
import path from 'path'
import kebabCase from 'lodash.kebabcase'
import { nanoid } from 'nanoid'
import createSupabaseServerClient from '@/lib/supabase/server'
import { Collection, DBRecipe } from '@/lib/types'
import pick from 'lodash.pick'
import { unstable_noStore } from 'next/cache'

import client from '@/lib/aws/config'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { Inputs } from '../[handle]/edit/schema'
import readUserSession from '@/lib/actions'

// export async function createTodo(title: string) {
//   const supabase = await createSupabaseServerClient()

//   const result = await supabase.from('recipes').insert({ title }).single()
//   revalidatePath('/recipes')
//   return JSON.stringify(result)
// }

type SearchParams = {
  q?: string|null
  page?: string|null
  collection_id?: string|null
  perPage: number
}

export async function getRecipes({ q, page = '1', collection_id, perPage = 25 }: SearchParams) {
  unstable_noStore()
  const supabase = await createSupabaseServerClient()

  const query = supabase.from('recipes').select('*, collection:collections(id, name)', { count: 'exact' })

  if (q) {
    query.ilike('name', `%${q}%`)
    // query.ilike('collection.name', `%${q}%`)
    // query.or(`name.ilike.%${q}%, collections.name.ilike.%${q}%`, { foreignTable: 'collections' })
  }

  if (collection_id) {
    query.eq('collection_id', collection_id)
  }

  const pageIndex = Number(page) - 1
  query.range(pageIndex * perPage, (pageIndex * perPage) + (perPage - 1))

  query.order('created_at', { ascending: false })

  const result = await query

  return result
}

export async function readCollections() {
  unstable_noStore()
  const supabase = await createSupabaseServerClient()

  const result = await supabase.from('collections').select('name, id, recipes(name)')

  return result as { data: Collection[] }
}

export async function createRecipe(_values: Inputs, fileData: FormData) {
  const values: DBRecipe = _values

  values.handle = `${kebabCase(values.name.substr(0, 50).trim())}-${nanoid(8)}`

  if (typeof values.ingredients === 'string') {
    values.ingredients = values.ingredients?.split('\n').map((v: string) => v.trim())
  }

  try {
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

    const response = await supabase.from('recipes').insert(pick(values as DBRecipe, ['name', 'collection_id', 'prepTime', 'cookTime', 'totalTime', 'yield', 'is_public', 'ingredients', 'instructions', 'image', 'handle'])).select().single()
    return response
  } catch (e) {
    console.log('error creating recipe', e)
    return {
      data: null,
      error: {
        message: (e as Error).message,
      },
      count: null,
      status: 400,
      statusText: 'ServerError'
    }
  }
}

export async function saveToHistory(recipe_id: string) {
  const supabase = await createSupabaseServerClient()
  const { data } = await readUserSession()

  if (data.session) {
    await supabase.from('history').upsert({
      user_id: data.session.user.id,
      recipe_id
    }, {
      onConflict: 'user_id, recipe_id'
    })
  }
}