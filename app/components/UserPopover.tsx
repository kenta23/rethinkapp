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
        <PopoverTrigger>
        <Avatar user={data?.user.image as string} />
        </PopoverTrigger>

        <PopoverContent className="bg-[#e1e0e9] text-black flex flex-col gap-2 w-[200px] h-auto py-2  ">
          <div className="w-full pb-2 border-b-2 border-gray-300 flex items-center flex-row-reverse justify-end gap-3">
            <p className="text-gray-600 font-medium text-sm">
              {data?.user.name ? data?.user.name : data?.user.email}
            </p>
            <div className="h-[30px] w-[30px]">
              <Avatar user={data?.user.image as string} />
            </div>
          </div>

          <div>
            <LinkButton
              href={"/profile"}
              icon={<Settings size={24} className="text-black" />}
              text="Profile Setings"
              variant={"link"}
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex items-center">
                  <LogOut />
                  <Button
                    variant={"link"}
                    className={`text-black font-medium sm:text-[16px] md:text-[20px]`}
                  >
                    Logout
                  </Button>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure you want to logout?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
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
