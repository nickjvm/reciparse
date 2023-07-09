import RecipeError from '@/components/RecipeError'
import withHeader from '@/components/withHeader'

// infinite loop is only in development env :shrug:
// https://github.com/vercel/next.js/discussions/50429
export function Error() {
  return (
    <RecipeError actionText="Take me home." actionUrl="/" />
  )
}

export default withHeader(Error, { withSearch: true })