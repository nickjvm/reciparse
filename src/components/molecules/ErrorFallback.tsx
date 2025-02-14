'use client'
import RecipeError from './RecipeError'

const Fallback = ({ error }: { error: Error }) => {
  return (
    <div className="max-w-xl mx-auto flex items-center min-h-screen">
      <RecipeError type="critical" details={error} actionUrl="/" actionText="Go home" />
    </div>
  )
}
export default Fallback
