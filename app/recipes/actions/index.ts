'use server'

import createSupabaseServerClient from '@/lib/supabase/server'
import { revalidatePath, unstable_noStore } from 'next/cache'

export async function createTodo(title: string) {
  const supabase = await createSupabaseServerClient()

  const result = await supabase.from('recipes').insert({ title }).single()
  revalidatePath('/recipes')
  return JSON.stringify(result)
}

export async function readTodo() {
  unstable_noStore()
  const supabase = await createSupabaseServerClient()

  const result = await supabase.from('recipes').select('*, collections(name)')

  return result
}

export async function readCollections() {
  unstable_noStore()
  const supabase = await createSupabaseServerClient()

  const result = await supabase.from('collections').select('name, recipes(name)')

  return result
}

// export async function deleteTodoById(id: string) {}

// export async function updateTodoById(id: string, completed: boolean) {}
