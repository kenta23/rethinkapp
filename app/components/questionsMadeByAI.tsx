import React, { useEffect, useState } from 'react'
import { CreateMessage, } from 'ai/react'
import { Lightbulb, SendHorizontal } from 'lucide-react';
import axios from 'axios';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { Message } from 'ai/react';
import { useRouter } from 'next/navigation';
import { ChatRequestOptions } from 'ai';


export default function QuestionsMadeByAI({
  fileKey,
  Aiquestions,
  id,
  append,
  handleSubmit,
  setClicked
}: {
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
  fileKey: string;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
  Aiquestions: string[];
  id: string;
}) {
  console.log('Aiquestions', Aiquestions);

  return (
    <div>
        <ul className="text-start text-sm flex gap-3 flex-col w-full px-4 py-3 mb-2">
          {Aiquestions.map(
            (question, index) =>
              index < 3 && (
                <form
                  onSubmit={handleSubmit}
                  key={index}
                  className="p-2 flex gap-2 items-center justify-center cursor-pointer shadow-sm text-[#40545e] 
                         rounded-lg bg-white hover:bg-gray-100 "
                >
                  <button
                    type="submit"
                    name="question"
                    onClick={() => {
                      append({
                        role: "user",
                        content: question,
                      });

                      setClicked(true);
                    }}
                    className="flex gap- cursor-pointer items-center w-auto"
                  >
                    <div className="size-5">
                      <Lightbulb size={18} className="text-[#4181A2]" />
                    </div>
                    <span className="text-wrap text-center text-xs md:text-sm">{question}</span>
                  </button>
                </form>
              )
          )}
        </ul>
    </div>

  );
}
