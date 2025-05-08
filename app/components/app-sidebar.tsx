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
import { ChevronUp, Home, MessageCircleMore, MoreHorizontal } from "lucide-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";



export function AppSidebar() {
    const session = useSession();

    const { data: chatHistory, isSuccess, isFetching, isError } = useQuery({ 
         queryFn: async () => axios.get('/api/projects'),
         queryKey: ['chat-history'],
         staleTime: 1000 * 60 * 5,
    })

    const { state } = useSidebar();
    
    return (
      <Sidebar collapsible="icon" className="bg-linear-to-b from-[#252031] to-[#383440]">
         <SidebarHeader>
             <SidebarGroup className="flex flex-row justify-between items-center">
              <Image className={`${state === "collapsed" ? "hidden" : "block"}`} src={'/Logo white with text.png'} alt="rethink logo" width={50} height={110}/>
                <SidebarTrigger />
             </SidebarGroup>
          </SidebarHeader>
          
        <SidebarContent hidden={state === "collapsed"} className="px-4 py-2">
            {/**RENDER CHAT HISTORY HERE */}
            <SidebarMenu className="flex flex-col h-auto w-full gap-3 items-start">
                {isFetching ? <p>Loading...</p> : chatHistory?.data.map((chat: any) => (
                      <SidebarMenuItem key={chat.id} className="px-3 py-4 rounded-xl bg-white/10 backdrop-blur-sm w-full flex justify-between items-center">
                             <div className="flex flex-row gap-1 items-center">
                               <MessageCircleMore /> 
                               <p className="text-sm">{chat.name}</p>
                             </div> 
   
                           
                                <MoreHorizontal />
                  
                      </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
            <div className="flex flex-row justify-start items-center gap-2">
                <Image className="border-[#8E61EC] border-2 rounded-full" src={session.data?.user?.image || ''} alt="rethink logo" width={40} height={110} objectFit="cover"/>        
                <p className="text-sm">{session.data?.user?.name}</p>
            </div>
        </SidebarFooter>
      </Sidebar>
    )
  }
  