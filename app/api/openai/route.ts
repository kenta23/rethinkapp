import OpenAI from 'openai';
import { Message, OpenAIStream, StreamData, StreamingTextResponse, streamText } from 'ai'; 
import { getContext } from '@/lib/context';
import { NextResponse } from 'next/server';
import { getXataClient } from '../../../src/xata';
import { getAnswer } from '@/actions/aigenerationtext';
import { openai as ai } from '@ai-sdk/openai';



const openai = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
}); 
 
// IMPORTANT! Set the runtime to edge
//export const runtime = 'edge';
const xata = getXataClient();
 

export async function POST(req: Request) {
  const { messages, fileKey, userId, id } = await req.json();


  if(!fileKey) return NextResponse.json({ error: "missing file key"}, { status: 404 });
  
  try {
    const lastMessage = messages[messages.length - 1]; //get user input
    const context = await getContext(lastMessage.content, fileKey); //embed user input 


    const prompt = {
      role: "system",
      content: `You are a helpful AI assistant that can answer related to the provided context.
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
    };

    /*const response = await openai.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      max_tokens: 200,
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      stream: true,
    });  */

    const response = await streamText({
       model: ai("gpt-3.5-turbo"),
       system: prompt.content,
       temperature:0.4,
       prompt: lastMessage.content as string,
       maxTokens: 300
    })

    const stream = response.toAIStream({
      onStart: async () => {
        await xata.db.chats.create({
          //save user messages
          user_id: userId,
          role: "user",
          content: lastMessage.content,
          document_id: id,
        });
      },
      onCompletion: async (completion) => {
        await xata.db.chats.create({
          //save ai messages
          user_id: userId,
          role: "assistant",
          content: completion,
          document_id: id,
        });
      },
    });

    // Convert the response into a friendly text-stream
    /*const stream = OpenAIStream(response, {
     onStart: async () => {
        await xata.db.chats.create({  //save user messages
           user_id: userId,
           role: 'user',
           content: lastMessage.content,
           document_id: id
        })
    },
    onCompletion: async (completion) => {
       await xata.db.chats.create({ //save ai messages
        user_id: userId,
        role: 'assistant',
        content: completion,
        document_id: id
     })
    }, 
   }); */

   return new StreamingTextResponse(stream);

  } catch (error) {

     console.log("ERROR", error);
  }
}


