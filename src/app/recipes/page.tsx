'use client'
import { useEffect, useState } from 'react'

import request from '@/lib/api'
import AppLayout from '@/components/layouts/AppLayout'
import RecipeError from '@/components/molecules/RecipeError'
import SearchList from '@/components/organisms/SearchList'
import { PlusIcon } from '@heroicons/react/24/outline'
import Button from '@/components/atoms/Button'

export default function Page() {
  const [count, setCount] = useState(0)
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  const endpoint = '/api/recipes/mine'

  useEffect(() => {
    getCount()
  }, [])

  const getCount = async () => {
    const { data, error } = await request(`${endpoint}?count=true`)
    if (error) {
      setError(true)
    } else if (data) {
      setCount(data.count)
    }

    setLoading(false)
  }

  const renderChildren = () => {
    if (error) {
      return <RecipeError image="/404.svg" errorText="Something went wrong. Try again later." className="mb-6" type="generic" details={{ message: 'error getting favorites count'}} />
    } else if (!loading && !count) {
      return <RecipeError errorTitle="Start saving!" actionUrl="/recipes/create" actionText="Add one now!" image="/favorite.svg" errorText="Looks like you haven't created any recipes yet." className="mb-6" />
    } else {
      return <SearchList title="My Recipes" endpoint={endpoint} loading={loading} count={count} error={error} internal cta={<Button className="h-full" icon={<PlusIcon className="w-5 inline-block" />} as="link" href="/recipes/create">Add a recipe</Button>} />
    }
  }

  return (
    <AppLayout withSearch isPrivate className="py-4">
      <title>My Recipes | Reciparse</title>
      {renderChildren()}
    </AppLayout>
  )
}