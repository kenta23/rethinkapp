'use client';

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "./ui/alert-dialog";
import Avatar from './Avatar';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, Menu, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { LinkButton } from './Navbar';
import { Session } from 'next-auth';
import { useQueryClient } from '@tanstack/react-query';


  
export default function UserPopover({ data }: { data: Session | null}) {

  const session = useSession();
  const queryClient = useQueryClient();

  async function handleLogout() { 
     await signOut();

     if (session.status === 'unauthenticated') { 
        queryClient.invalidateQueries({ queryKey: ['projects'] });
     }
  }
  return (
    <Popover>
        <PopoverTrigger className='cursor-pointer'>
           <Avatar user={data?.user.image as string} />
        </PopoverTrigger>

        <PopoverContent className="bg-white/25 text-white flex flex-col gap-2 w-[200px] h-auto py-2  ">
          <div className="w-full pb-2 border-b-2 border-gray-300 flex items-center flex-row-reverse justify-end gap-3">
            <p className="text-gray-200 font-medium text-sm">
              {data?.user.name ? data?.user.name : data?.user.email}
            </p>
            <div className="h-[30px] w-[30px]">
              <Avatar user={data?.user.image as string} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <LinkButton
              href={"/profile"}
              icon={<Settings size={20} />}
              text="Profile Setings"
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex items-center hover:text-gray-300 transition-all duration-200 gap-3 cursor-pointer">
                  <LogOut size={20}/>
                  <span
                    className={`font-normal text-md`}
                  >
                    Logout
                  </span>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className='bg-black/80'>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure you want to logout?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className='cursor-pointer hover:bg-black/20 transition-all duration-200'>Cancel</AlertDialogCancel>
                  <AlertDialogAction className='cursor-pointer bg-red-500 hover:bg-red-600 transition-all duration-200'
                    onClick={handleLogout}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </PopoverContent>
      </Popover>
  )
}
