import { handleSignOut } from '../actions'

export default function SignOut() {
  return (
    <form action={handleSignOut} className="inline-block">
      <button className="p-2 -mr-2 inline-block">Sign Out</button>
    </form>
  )
}