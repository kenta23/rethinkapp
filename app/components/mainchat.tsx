"use client"

import React from 'react'
import DocumentFile from './documentViewer'
import Chats from './chats'

import '@/styles/main.css'
import { truncateString } from '@/lib/utils'


type ChatType = {
  id: string;
  user_id: string | null;
  created_at: Date;
  updated_at: Date;
  role: string | null;
  content: string | null;
  document_id: string;
};

type UserType = {
  id: string;
  created_at: Date;
  updated_at: Date;
};

export type DocumentType = {
  id: string;
  name: string | null;
  file_key: string | null;
  file_link: string | null;
  created_at: Date;
  updated_at: Date;
  chats: ChatType[];
  user: UserType;
  guestUser: UserType;
};


export default function Main({ data }: { data: DocumentType | null}) {

 
  return (
    <div className="w-full h-full min-w-full">
      <main className="flex w-full flex-row justify-center h-full">
        {/**DOCUMENT FILE */}
        <div
          className="px-6 py-4 w-auto grow-7 h-full"
        >
          {/**MAP THE DOCUMENTS HERE */}
          <DocumentFile selectedFile={data?.file_link} />
        </div>

        {/**CHAT BOX */}
        <div className="border-[#A782F5] border-l grow-3 w-1/4 h-full">
          <div className='w-full px-4 py-3 mt-2'>
            <p className='text-black text-center dark:text-white font-medium text-md'>{truncateString(data?.name as string || '', 20)}</p>
         </div>
          {/**CHAT COMPLETION  */}
          <Chats data={data} />
        </div>
      </main>
    </div>
  );
}