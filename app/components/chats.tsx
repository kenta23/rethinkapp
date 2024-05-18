'use client'

import { Message, useChat, useCompletion } from 'ai/react';
import { Send, SendHorizontal, X } from 'lucide-react';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { getAnswer, getSuggestionContext } from '@/actions/aigenerationtext';
import { auth } from '@/auth';
import QuestionsMadeByAI from './questionsMadeByAI';


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
  
    const { input, handleSubmit, handleInputChange, messages, isLoading, data, append } = useChat({
        api: '/api/openai',
        body: {
          fileKey,
          userId,
          id
        },
        onFinish: (res) => {
             console.log("Successfully created chat");
        },
        initialMessages: chatdata || [],
    })
    

   useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop = messageContainer.current?.scrollHeight;
    }
   }, [messages, isLoading])
   

  useEffect(() => {
    async function getData() {
       const { text } = await getSuggestionContext(fileKey);
       const dividedQuestions = text.split(/\d+\./).filter(question => question.trim().length > 0);
       setAiquestions(dividedQuestions);  
    }
     if(!chatdata?.length && !loading && !isFetching) {
       getData();
     }
}, [chatdata, loading, isFetching, fileKey]) 

    return (
      <div className="overflow-y-auto h-full max-h-screen min-h-screen  "> 
        <div className='flex relative flex-col w-full h-full'>
          <div
            ref={messageContainer}
            className="w-full 
            h-[65%]
            md:h-[75%]
            min-h-[calc(100% - 200px)]
            p-3 flex 
            flex-col relative items-end justify-end overflow-y-auto"
          >
            <div className="flex self-end overflow-y-scroll flex-col gap-6 md:gap-[24px] h-auto w-full">
              {/**CHAT STREAMING HERE */}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex items-start", {
                    "self-end": m.role === "user",
                  })}
                >
                  {/**CHAT BOX */}
                  <div
                    className={cn(
                      "text-wrap mx-2 whitespace-normal break-words text-white w-fit p-2 rounded-md",
                      {
                        "bg-[#8768a5]": m.role === "assistant",
                        "bg-[#3970b8]": m.role === "user",
                      }
                    )}
                  >
                    <div>
                      <p className="text-md">{m.content}</p>
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

              {isLoading && (
                <div className="self-end text-start text-sm left-0 flex items-start text-gray-400 w-full">
                  Waiting for response.....
                </div>
              )}
            </div>
          </div>

          <div className={`w-full ${!chatdata?.length && "absolute bottom-44 md:bottom-36"} h-auto self-end flex items-center flex-col left-0`}>
            {!chatdata?.length && !loading && !clicked ? (
              <QuestionsMadeByAI
                fileKey={fileKey as string}
                id={id as string}
                append={append}
                handleSubmit={handleSubmit}
                Aiquestions={Aiquestions}
                setClicked={setClicked}
              />
            ) : <div className='h-auto'/>}
            {/**USER INPUTS HERE */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center 
                justify-center overflow-hidden 
                w-full gap-2 min-w-full px-2"
            >
              <input
                onChange={handleInputChange}
                type="text"
                className="border-accentColor bg-white
                 focus:outline-accentColor border rounded-full w-full h-[50px] indent-3"
                placeholder="Ask any question"
                value={input}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`${
                  isLoading ? "opacity-70" : "opacity-100"
                }`}
                disabled={isLoading}
              >
                <Send
                  color="#ffff"
                  size={32}
                  className="bg-secondaryColor md:w-[60px] lg:w-[40px] lg:h-auto rounded-lg p-2 hover:bg-[#5C87C7] cursor-pointer duration-200 ease-in-out"
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
}


