import React from 'react'
import Image from 'next/image'
import { Session } from 'next-auth'


export default function Avatar({ user }: { user: string | null}) {
  return (
    <div className="size-[30px]">
        <Image 
          src={user ? user :'/empty user.jpg'} 
          alt="user"
          width={500}
          height={500}
          className="rounded-full object-cover size-8"
          loading="lazy"
          quality={100}
         />
    </div>
  )
}
