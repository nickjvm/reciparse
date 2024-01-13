'use client'

import createSupabaseBrowserClient from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

function User() {
  const [session, setSession] = useState<Session|null>(null)
  useEffect(() => {
    async function fetchSession() {
      const supabase = await createSupabaseBrowserClient()
      const { data: { session }} = await supabase.auth.getSession()
      setSession(session)
    }

    fetchSession()

  }, [])

  if (session){
    return <div>{session.user.email}</div>
  } else {
    return <div>loading...</div>
  }
}

export default function Foo() { return <User /> }