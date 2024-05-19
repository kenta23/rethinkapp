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
        <div className="flex justify-between flex-col w-full h-full max-h-[490px] md:max-h-[620px] lg:max-h-[650px]">
          <div
            ref={messageContainer}
            className={`w-full flex-1 p-3 flex flex-col items-end justify-end overflow-y-auto`}
          >
            <div className="flex self-end overflow-y-scroll flex-col gap-6 md:gap-[24px] w-full">
              {/** CHAT STREAMING HERE */}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start ${
                    m.role === "user" ? "self-end" : ""
                  }`}
                >
                  {/** CHAT BOX */}
                  <div
                    className={`text-wrap mx-2 whitespace-normal break-words text-white w-fit p-2 rounded-md ${
                      m.role === "assistant" ? "bg-[#8768a5]" : "bg-[#3970b8]"
                    }`}
                  >
                    <div>
                      <p className="text-sm md:text-[16px]">{m.content}</p>
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

          {/** CHAT INPUTS AND SUGGESTIONS */}
          <div className={`w-full ${!chatdata?.length ? 'h-auto max-h-full md:max-h-[370px]' : 'h-auto'} py-2 items-end mb-0 lg:mb-8 flex flex-col justify-end `}>
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
            {/** USER INPUTS HERE */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-center w-full gap-2 px-2"
            >
              <input
                onChange={handleInputChange}
                type="text"
                className="border-accentColor bg-white focus:outline-accentColor border rounded-full w-full h-[50px] indent-3"
                placeholder="Ask any question"
                value={input}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`${
                  isLoading ? "opacity-70" : "opacity-100"
                } bg-secondaryColor size-10 rounded-lg p-2 hover:bg-[#5C87C7] flex items-center justify-center cursor-pointer duration-200 ease-in-out`}
                disabled={isLoading}
              >
                <Send color="#ffff" size={32} className="" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
}


