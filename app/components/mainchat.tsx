"use client"

import NavbarMain from '@/components/navbar-main'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import DocumentFile from './documentViewer'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { savedDataDbType } from '../../types'
import { toast } from 'sonner'
import Chats from './chats'
import { useRouter } from 'next/navigation'

import '@/styles/main.css'
import { changeName } from '@/actions/projects'
import { truncateString } from '@/lib/utils'

export default function Main({ data }: { data: savedDataDbType }) {
  const inputRef = useRef<HTMLInputElement>(null!);
  const router = useRouter();



  return (
    <div className="w-full h-full min-w-full">
      <main className="flex w-full flex-row justify-center h-full">
        {/**DOCUMENT FILE */}
        <div
          className="px-6 py-4 w-auto grow-7 h-full"
        >
          {/**MAP THE DOCUMENTS HERE */}
          <DocumentFile selectedFile={data?.[0].file_link} />
        </div>

        {/**CHAT BOX */}
        <div className="border-[#A782F5] border-l grow-3 w-1/4 h-full">
          <div className='w-full px-4 py-3 mt-2'>
            <p className='text-black text-center dark:text-white font-medium text-md'>{truncateString(data?.[0].name as string, 20)}</p>
         </div>
          {/**CHAT COMPLETION  */}
          <Chats fileKey={data?.[0].file_key as string} id={data?.[0].id as string} />
        </div>
      </main>
    </div>
  );
}