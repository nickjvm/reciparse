'use client'
import { useEffect, useState } from 'react'

import request from '@/lib/api'
import AppLayout from '@/components/layouts/AppLayout'
import RecipeError from '@/components/molecules/RecipeError'
import SearchList from '@/components/organisms/SearchList'

export default function Page() {
  const [count, setCount] = useState(0)
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCount()
  }, [])

  const getCount = async () => {
    const { data, error } = await request('/api/recipes/favorites?count=true')
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
      return <RecipeError errorTitle="Start saving!" image="/favorite.svg" errorText="Looks like you haven't saved any recipes yet." className="mb-6" />
    } else {
      return <SearchList title="My Favorites" endpoint="/api/recipes/favorites" internal loading={loading} count={count} error={error} />
    }
  }

  return (
    <AppLayout withSearch isPrivate className="py-4">
      <title>My Favorites | Reciparse</title>
      {renderChildren()}
    </AppLayout>
  )
}