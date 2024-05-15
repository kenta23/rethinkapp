"use client"

import { UserButton,  useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { dark } from "@clerk/themes";
import { useSession } from "next-auth/react";
import Avatar from "./Avatar";


export default function NavbarMain() {
  const session = useSession();
  const pathname = usePathname();
  
  return (
    <div className="w-full bg-[#7173b9] h-[60px] flex items-center">
      <nav className="px-[12px] md:px-12 text-white py-2 flex justify-between items-center w-full">
        {/**LOGO HERE */}
        <div>
          <Link href={"/"}>
            <Image
              src={"/Logo white with text.png"}
              width={45}
              height={45}
              alt="Logo white with text"
            />
          </Link>
        </div>

        <div className="flex items-center justify-between gap-6">
          <Link href={"/"} className="text-sm font-normal md:text-[18px]">
            Home
          </Link>
          {session.data?.user ? (
            <Avatar user={session.data?.user.image as string}/>
          ) : (
            <Link
              href={pathname.includes("/login") ? "/register" : "/login"}
              className="text-md font-normal md:text-[18px]"
            >
              {pathname.includes("/register") ? "Login" : "Sign up"}
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}