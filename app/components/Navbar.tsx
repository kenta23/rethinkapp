'use client'

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LogOut, Menu, Settings } from "lucide-react";
import { useSession } from 'next-auth/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import Avatar from "./Avatar";
import { Card, CardContent } from "./ui/card";
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
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import UserPopover from "./UserPopover";


export const LinkButton = ({
  href,
  variant,
  text,
  className,
  icon
}: {
  icon: JSX.Element;
  href: string;
  variant: string | any;
  text: string;
  className?: string;
}) => {
  return (
    <Link href={href} className="flex items-center">
      {icon}
      <Button
        variant={variant}
        className={`text-black font-medium sm:text-[16px] md:text-[20px] ${className}`}
      >
        {text}
      </Button>
    </Link>
  );
};

const Navbar = () => {
  const { data } = useSession();

  return (
    <nav className="w-full text-white top-0 z-10 flex py-2 justify-between items-center">
      <div>
        <Link href={"/"}>
          <Image
            width={30}
            height={30}
            alt={"Logo"}
            src={"/Logo white.png"}
            className=""
          />
        </Link>
      </div>

      {data?.user ? (
        <div className="items-center gap-3 hidden md:flex">
          {/**USER ALREADY LOGGED IN */}
          <p className="text-white font-medium text-sm">
            {data?.user.name ? data?.user.name : data?.user.email}
          </p>

             <UserPopover data={data}/>
          {/* User not authenticated */}
        </div>
      ) : (
        <Link href={"/login"} className="text-md font-normal md:text-[18px]">
          Log in
        </Link>
      )}

      {/**FOR SMALLER SCREEN VIEW */}
      <Popover>
        <PopoverTrigger className="block md:hidden">
          <Menu color="#ffff" size={32} />
        </PopoverTrigger>

        <PopoverContent className="bg-[#e1e0e9] text-black flex flex-col gap-2 w-[200px] h-auto py-2 ">
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
                <div className="flex  items-center">
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
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  );
};

export default Navbar;