import { Message, OpenAIStream, StreamData, StreamingTextResponse, streamText } from "ai";
import { getXataClient } from "../../../src/xata";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getContext } from "@/lib/context";
import { openai as ai } from '@ai-sdk/openai'


const openai = new OpenAI({
    apiKey: process.env.TOGETHER_API_KEY,
    baseURL: 'https://api.together.xyz/v1',
}); 
   
const xata = getXataClient();
export const runtime = 'edge';
 
export async function POST(req: Request, res:Response) {
     const { question, userId, id, fileKey } = await req.json();
  
     try {
       //const lastMessage = messages[messages.length - 1]; //get user input
       const context = await getContext(question, fileKey); //embed user input 
      
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
   
       const result = await openai.chat.completions.create({
         model: "mistralai/Mixtral-8x7B-Instruct-v0.1", 
         max_tokens: 256,
         temperature: 0.4, 
         stream: true,
         messages: [
           {
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
           },
           {
             role: "user",
             content: question,
           },
         ],
       }); 

      
       const stream = OpenAIStream(result, {
          async onStart() {
            await xata.db.chats.create({  //save user messages
                user_id: userId,
                role: 'user',
                content: question,
                document_id: id
             })
          },
         async onCompletion(completion) {
            await xata.db.chats.create({ //save ai messages
                user_id: userId,
                role: 'assistant',
                content: completion,
                document_id: id
             })
         },
         
       })
       return new StreamingTextResponse(stream);

       //return NextResponse.json({ message: stream }, { status: 200 });
    }
    catch(err) {
       return NextResponse.json({ message: err }, { status: 400 });
    } 
}