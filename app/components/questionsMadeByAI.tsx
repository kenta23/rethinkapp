import React, { useEffect, useState } from 'react'
import { CreateMessage, } from 'ai/react'
import { SendHorizontal } from 'lucide-react';
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

  const router = useRouter();
  const [questionPicked, setQuestionPicked] = useState<string>("");
  const queryClient = new QueryClient();
  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (data: any) => await axios.post("/api/chat", data),
  });


  return (
    <div>
      {isPending && (
        <div className="self-end text-end text-sm flex items-end py-2 px-3 text-gray-400 w-full">
          <span>Waiting for response.....</span>
        </div>
      )}
      <p>{questionPicked}</p>

        <ul className="text-start text-sm flex gap-3 flex-col w-fit px-6 py-8">
          {Aiquestions.map(
            (question, index) =>
              index < 3 && (
                <form
                  onSubmit={handleSubmit}
                  key={index}
                  className="p-2 flex gap-2 items-center cursor-pointer shadow-sm text-[#40545e] 
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
                    className="flex gap-2 items-center w-auto"
                  >
                    <div className="size-5">
                      <SendHorizontal size={20} className="text-[#4181A2]" />
                    </div>
                    <span className="text-wrap">{question}</span>
                  </button>
                </form>
              )
          )}
        </ul>
    </div>

  );
}
