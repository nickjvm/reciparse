'use client'
import { useEffect, useState } from 'react'
import { Database } from '@/types/database.types'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
// import supabase from '@/lib/supabaseClient'

export default function AccountForm({ session }: { session: Session | null }) {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  // const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const user = session?.user

  console.log(session)
  // const getProfile = useCallback(async () => {
  //   try {
  //     setLoading(true)

  //     const { data, error, status } = await supabase
  //       .from('profiles')
  //       .select(`full_name, username, website, avatar_url`)
  //       .eq('id', user?.id)
  //       .single()

  //     if (error && status !== 406) {
  //       throw error
  //     }

  //     if (data) {
  //       setFullname(data.full_name)
  //       setUsername(data.username)
  //       setWebsite(data.website)
  //       setAvatarUrl(data.avatar_url)
  //     }
  //   } catch (error) {
  //     alert('Error loading user data!')
  //     console.log(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [user, supabase])

  const getUser = async () => {
    const user = await supabase.auth.getUser()
    console.log(user)
  }
  useEffect(() => {
    getUser()
  }, [])

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session?.user.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ fullname, username, website, avatar_url: '' })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" type="submit" onClick={handleSignOut}>
            Sign out
        </button>
      </div>
    </div>
  )
}