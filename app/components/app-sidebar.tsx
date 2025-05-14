'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenuItem,
    SidebarMenu,
    SidebarTrigger,
    useSidebar,
    SidebarMenuButton,
    SidebarMenuAction,
  } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Archive, ChevronUp, Home, MessageCircleMore, MoreHorizontal } from "lucide-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import AppSidebarForm from "./app-sidebar-form";
import { usePathname } from "next/navigation";
import { truncateString } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";


export function AppSidebar() {
    const session = useSession();
    const pathname = usePathname();

    const { data: chatHistory, isSuccess, isFetching, isError } = useQuery({ 
         queryFn: async () => axios.get('/api/projects'),
         queryKey: ['chat-history'],
         staleTime: 1000 * 60 * 5,
    })

    const { state } = useSidebar();
    
    return (
      <Sidebar
        collapsible="icon"
        className="bg-linear-to-b overflow-x-hidden from-[#252031] to-[#383440]"
      >
        <SidebarHeader>
          <SidebarGroup className="flex flex-row justify-between items-center">
            <Image
              className={`${state === "collapsed" ? "hidden" : "block"}`}
              src={"/Logo white with text.png"}
              alt="rethink logo"
              width={50}
              height={110}
            />
            <SidebarTrigger />
          </SidebarGroup>
        </SidebarHeader>

        <SidebarContent hidden={state === "collapsed"} className="px-4 py-2">
          {/**RENDER CHAT HISTORY HERE */}
          <SidebarMenu className="flex overflow-x-hidden scroll relative flex-col h-auto w-full gap-3 items-start">
            {isFetching ? (
               Array.from({length: 4}).map((__, index) => { 
                   return (
                      <Skeleton key={index} className={`px-3 py-2 h-10 rounded-xl bg-white/10 backdrop-blur-sm  w-full flex justify-between items-center`}>                         
                      </Skeleton>
                   )
               })
            ) : (
              chatHistory?.data.map((chat: any) => (
                <SidebarMenuItem
                  key={chat.id}
                  className={`px-3 py-2 rounded-xl bg-white/10 ${pathname === `/main/${chat.id}` && "bg-white/5"} backdrop-blur-sm w-full flex justify-between items-center`}
                >
                  <Link className="cursor-pointer w-full" href={`/main/${chat.id}`}>
                    <SidebarMenuButton asChild>
                    <div className="flex flex-row gap-1 items-center">
                      <MessageCircleMore />
                      <p className="text-sm">{truncateString(chat.name, 15)}</p>
                    </div>
                    </SidebarMenuButton>
                  </Link>
                  <AppSidebarForm id={chat.id} />
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center gap-2">
            <Image
              className="border-[#8E61EC] border-2 rounded-full"
              src={session.data?.user?.image || "/empty user.jpg"}
              alt="rethink logo"
              width={40}
              height={110}
              objectFit="cover"
            />
            <p className="text-sm">{session.data?.user?.name || "Anonymous"}</p>
          </div>

          <Link href={"/projects"} className="">
            <Archive cursor={"pointer"} />
          </Link>
        </SidebarFooter>
      </Sidebar>
    );
  }
  