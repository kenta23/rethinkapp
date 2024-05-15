import { auth, signOut } from '@/auth';
import UserInfo from '@/components/userInfo';
import Link from 'next/link';
import React from 'react'

export default async function User() {
  
  const session = await auth(); 
  return (
    <main className="flex items-center justify-center h-screen">
      {session?.user ? <p>My Provider: {session.user.provider}</p> : <p>Not logged in</p>}

      {session?.user &&
       <form action={async () => {
        "use server" 
         await signOut({redirectTo:'/login'})
       }}>
        <button>        
          Log out
       </button>
      </form>}
  </main>
  )
}
