'use client'

import { Message, useChat } from '@ai-sdk/react';
import { Send } from 'lucide-react';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { getSuggestionContext } from '@/actions/aigenerationtext';
import QuestionsMadeByAI from './questionsMadeByAI';
import { Skeleton } from './ui/skeleton';
import { DocumentType } from './mainchat';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Chats ({ data }: { data: DocumentType | null }) {
    const session = useSession();
    const [Aiquestions, setAiquestions] = useState<string[]>([]);
    
    const messageContainer = useRef<HTMLDivElement>(null);
    const [clicked, setClicked] = useState<boolean>(false);

    const { data: chatdata, isLoading: loading, error, isFetching } = useQuery({  
      queryKey: ['chats', data?.id], 
      queryFn: async () => {
        const response = await axios.post<Message[]>("/api/getMessages", {
            id: data?.id 
        });
        return response.data;
      },
      staleTime: 40 * 1000, //40 seconds staletime
   })
  
    const { input, handleSubmit, handleInputChange, messages, status, append } = useChat({
        api: '/api/openai',
        maxSteps: 3,
        onToolCall({ toolCall, }) {
            console.log('tool call', toolCall);
        },
        body: {
          fileKey: data?.file_key, 
          userId: data?.user?.id,
          guestUserId: data?.guestUser?.id,
          id: data?.id
        },
        sendExtraMessageFields: true,
        onFinish: (res) => {
             console.log("Successfully created chat");
        },
        initialMessages: chatdata || [],
    })
    

   

   useEffect(() => {
    if (messageContainer.current) {
      setTimeout(() => {
        messageContainer.current?.scrollTo({
          top: messageContainer.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
   }, [messages, status]);
   

  useEffect(() => {
    //Questions made by AI
    //This will get the questions made by AI from the document if theres no chat initially
    async function getData() {
       const { text } = await getSuggestionContext(data?.file_key || '');
       const dividedQuestions = text.split(/\d+\./).filter(question => question.trim().length > 0);
       setAiquestions(dividedQuestions);  

    }
     if(!chatdata?.length && !loading && !isFetching) {
       getData();
     }
}, [chatdata, loading, isFetching, data?.file_key]) 

    return (
      <div className="h-full max-h-screen">
        <div className="w-full py-3 h-full min-h-screen flex flex-col justify-end items-center">
          <div
            ref={messageContainer}
            className={`w-full p-3 h-auto flex flex-col overflow-y-auto`}
          > 
          {/**If there is no chat data, loading, and clicked is false, then show the questions made by AI */}
            {!chatdata?.length && !loading && !clicked ? (
              <div className="h-auto justify-end mx-auto w-full flex flex-col items-center gap-2">
                <QuestionsMadeByAI
                  fileKey={data?.file_key as string}
                  id={data?.id as string}
                  append={append}
                  handleSubmit={handleSubmit}
                  Aiquestions={Aiquestions}
                  setClicked={setClicked}
                />
              </div>
            ) :             
          <div className="flex self-end flex-col gap-4 w-full">
            {/** CHAT STREAMING HERE */}
             {isFetching ? (
              Array.from({length: 2}).map((__, index) => { 
                return (
                   <div key={index} className='flex flex-row gap-3 mb-3'> 
                        <Skeleton key={index} className={`px-3 py-2 h-10 rounded-xl bg-white/15 backdrop-blur-sm w-full flex-1`}>                         
                       </Skeleton>    

                       <Skeleton className='size-10 rounded-full bg-white/15 backdrop-blur-sm'/>               
                   </div>
                )
              })
             ) :
               messages
               .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime())
               .map((m) => (
               <div
                 key={m.id}
                 className={cn(
                   "flex items-start",
                   m.role === "user" ? "self-end" : ""
                 )}
               >
                 {/** CHAT BOX */}
                 <div
                   className={`text-wrap mx-2 whitespace-normal break-words text-white w-fit p-2 rounded-md ${
                     m.role === "assistant" ? "bg-[#8768a5]" : "bg-[#3970b8]"
                   }`}
                 >
                   <div>
                     <p className="text-sm md:text-[16px]">{m.content}</p>
                     {/* <p>{m?.parts[0]?.type === 'tool-invocation' && m?.parts[0]?.toolInvocation?.toolName}</p> */}
                   </div>
                 </div>
                 {m.role === "user" && (
                   <Image
                     src={session.data?.user.image || "/empty user.jpg"}
                     alt="user avatar"
                     width={500}
                     height={500}
                     priority
                     className="rounded-full size-8 object-cover"
                   />
                 )}
               </div>
             ))}

             {status === 'submitted' && (
               <div className="text-start mx-1 my-1 text-sm left-0 flex items-start text-gray-400 w-full">
                 Waiting for response.....
               </div>
             )}
           </div>}
        </div>


          {/** USER INPUTS HERE */}
          <form
              onSubmit={handleSubmit}
              className="flex items-center justify-center w-full gap-1 px-2"
            >
              <input
                onChange={handleInputChange}
                type="text"
                className="outline-[#C86BDC] bg-white text-black outline rounded-full w-full h-[50px] indent-3"
                placeholder="Ask any question"
                value={input}
                disabled={status === 'streaming'}
              />
              <button
                type="submit"
                className={`${
                  status === 'streaming' ? "opacity-70" : "opacity-100"
                } bg-[#5C87C7] size-10 rounded-lg p-2 flex items-center justify-center cursor-pointer duration-200 ease-in-out`}
                disabled={status === 'streaming'}
              >
                <Send color="#ffff" size={32} className="" />
              </button>
            </form>
        </div>
      </div>
    );
}


