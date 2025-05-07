/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import Link from 'next/link'
import React, { ChangeEvent,  useState } from 'react'
import { Plus  } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import UserPopover from '@/components/UserPopover'
import AddProjectDialog from './addProjectDialog'



export default function Projects() {
    const session = useSession();

 
  return (
    <div className="px-5 md:px-[55px] w-full min-h-full py-4 md:py-[24px]">
      <nav className="flex justify-between px-2 md:px-8 items-center">
        <Link href={"/"}>
          <Image width={35} height={35} src={"/Logo.png"} alt={"Logo"} />
        </Link>

        {/**USER AUTHENTICATION */}
        <ul className="flex gap-4 items-center">
          <li className="font-medium text-sm md:text-[1rem] text-[#7f5fad] dark:text-[#b1a0c9]">
            <Link href={"/"}>Home</Link>
          </li>

          {session.data?.user ? (
            <div className="h-[30px] w-[30px]">
                <UserPopover data={session.data} />
            </div>
          ) : (
            <Button
              variant={"default"}
              className="bg-gradient-to-r hover:opacity-80 duration-150 ease-in-out from-violet-500 to-purple-500 hover:bg-violet-600 text-white px-3 rounded-sm py-2 "
            >
              <Link href={"/login"}>Login</Link>
            </Button>
          )}
        </ul>
      </nav>

      {/**ARCHIVES */}
      <div
        className="border-gray-20 
               max-w-[1100px] shadow-lg border-[1px] rounded-md relative w-full mt-[30px] 
               min-h-[750px] max-h-screen md:mt-[50px] mx-auto"
      >
        <div className="flex w-auto mt-[30px] mx-[10px] p-2 md:p-6 gap-4 items-start flex-col">
          <h3 className="self-center text-[18px] sm:text-[25px] md:text-[27px] text-[#4a4952] dark:text-gray-200">
            Your Projects
          </h3>

          {/**ARCHIVES */}
          <div className="w-full h-auto ">
            <AddProjectDialog session={session.data} />
          </div>
        </div>

        {/**PROPS IMAGES */}
        <Image
          src={"/book.svg"}
          alt="book avatar"
          width={90}
          height={50}
          quality={100}
          className="absolute top-1 right-2 w-[50px] md:w-auto"
        />

        <Image
          src={"/woman-with-book.svg"}
          alt="book avatar"
          width={90}
          height={100}
          quality={100}
          sizes="100vw"
          className="absolute left-2 bottom-0 "
        />
      </div>
    </div>
  );
}
