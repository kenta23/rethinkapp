'use client'

import { Message, useChat, useCompletion } from '@ai-sdk/react';
import { Send, SendHorizontal, X } from 'lucide-react';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { getAnswer, getSuggestionContext } from '@/actions/aigenerationtext';
import QuestionsMadeByAI from './questionsMadeByAI';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default  function Chats ({ fileKey, id }: { fileKey: string | null, id: string | null}): JSX.Element  {
    const session = useSession();
    const [Aiquestions, setAiquestions] = useState<string[]>([]);
    const userId = session.data?.user.id;
    const messageContainer = useRef<HTMLDivElement>(null);
    const [clicked, setClicked] = useState<boolean>(false);

    const { data: chatdata, isLoading: loading, error, isFetching } = useQuery({  
      queryKey: ['chats', id],
      queryFn: async () => {
        const response = await axios.post<Message[]>("/api/getMessages", {
          userId,
          id
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
          fileKey,
          userId,
          id
        },
        sendExtraMessageFields: true,
        onFinish: (res) => {
             console.log("Successfully created chat");
        },
        initialMessages: chatdata || [],
    })
    

    // console.log('MESSAGE PARTS', messages.map(m => m.parts.map(p => p.type === 'tool-invocation')));
    // console.log('tool result', messages.map(m => m.parts.map(p => p.type === 'tool-invocation' && p.toolInvocation?.state === 'result')));

    console.log('MESSAGES', messages);

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
       const { text } = await getSuggestionContext(fileKey);
       const dividedQuestions = text.split(/\d+\./).filter(question => question.trim().length > 0);
       setAiquestions(dividedQuestions);  

       console.log("AI QUESTIONS: ", Aiquestions);
    }

     if(!chatdata?.length && !loading && !isFetching) {
       getData();
     }
}, [chatdata, loading, isFetching, fileKey]) 

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
                  fileKey={fileKey as string}
                  id={id as string}
                  append={append}
                  handleSubmit={handleSubmit}
                  Aiquestions={Aiquestions}
                  setClicked={setClicked}
                />
              </div>
            ) :             
          <div className="flex self-end flex-col gap-4 w-full">
            {/** CHAT STREAMING HERE */}
            {/* @ts-ignore */}
             {messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((m) => (
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

          {/** CHAT INPUTS AND SUGGESTIONS */}
          {/* <div
            className={`w-full ${
              !chatdata?.length
                ? "h-auto max-h-full md:max-h-[370px]"
                : "h-auto"
            } py-2 items-end mb-0 lg:mb-10 flex flex-col justify-end `}
          >
            {!chatdata?.length && !loading && !clicked && (
              <div className="h-auto justify-end  mx-auto w-full flex flex-col items-center gap-2">
                <QuestionsMadeByAI
                  fileKey={fileKey as string}
                  id={id as string}
                  append={append}
                  handleSubmit={handleSubmit}
                  Aiquestions={Aiquestions}
                  setClicked={setClicked}
                />
              </div>
            )}
            
          </div> */}
        </div>
      </div>
    );
}


