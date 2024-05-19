
'use client'

import NavbarMain from '@/components/navbar-main'
import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ChatSkeleton from '@/components/ChatSkeleton'

export default function Loading() {
      return (
       <div className="w-full min-h-screen min-w-full h-screen overflow-x-hidden overflow-y-hidden ">
          <NavbarMain />
          
          <SkeletonTheme baseColor="#D0D0D0" highlightColor="#F0EAF3">
            {/**SIDEBAR */}
            <div  className="border w-full px-4 py-4 block h-full">
              {/**NAME OF THE DOCUMENT */}
              <div  className="py-3 h-[70px] md:h-[90%] flex flex-row w-full md:flex-col justify-between">
                  <div className="flex text-gray-700 max-w-full items-center cursor-pointer">
                    <Skeleton count={1} width={170} height={20}/>
                  </div>    
                {/**OPTIONS AVAILABLE */}
                <div className="text-gray-700 items-center flex gap-2">
                   <Skeleton count={1} width={140} height={25}/>
                </div>
              </div>
            </div>
            {/**FOR MOBILE DISPLAY CHAT */}
            <div className="absolute block md:hidden bottom-16 size-16 rounded-full right-5">
               <Skeleton circle className='size-16' />
            </div>
    
            {/**CHAT BOX */}
            <div className=" absolute top-16 right-0 hidden lg:block border w-[490px] min-h-[92%] h-[92%]">
              {/**TOP */}
              <div className="flex gap-2 text-primaryColor w-auto items-center m-4">
                <Skeleton width={100} height={30}/>
              </div>
    
              {/**CHAT COMPLETION  */}
                  <ChatSkeleton  />
            </div> 
          </SkeletonTheme>
        </div>
      )
  }
