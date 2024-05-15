import { getContext } from '@/lib/context';
import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';
import { getXataClient } from '../../../src/xata';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';


const xata = getXataClient();

export async function POST(req: Request, res:Response) {
  const session = await auth();
  const userId = session?.user.id as string;

  const { question, id, fileKey, questionSubmit, messages } = await req.json();

  if(!userId) {
    return NextResponse.json('User not Authenticated', { status: 401 });
  }
  
  try {
 /* 
   const context = await getContext(question, fileKey); //embed user input 

   const result = await streamText({
    model: openai('gpt-3.5-turbo-16k-0613'),
    system: `You are a helpful AI assistant that can answer related to the provided context.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses, and suggestions to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about the provided context from the document.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.
    `,
    prompt: question as string,
    temperature: 0.4
   });

   const stream  = result.toAIStream({
    async onStart() {
      await xata.db.chats.create({  //save user messages
          user_id: userId,
          role: 'user',
          content: question,
          document_id: id
       })
    },
   async onFinal(completion) {
      await xata.db.chats.create({ //save ai messages
          user_id: userId,
          role: 'assistant',
          content: completion,
          document_id: id
       })
   },
   })
   return new StreamingTextResponse(stream); */

   console.log('QUESTIONsUBMIT', messages);

  } catch (error) {
     return NextResponse.json({ message: error }, { status: 400 });
  }
 
}
