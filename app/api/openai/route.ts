import { Message, streamText, tool, TextPart } from 'ai'; 
import { getContext } from '@/lib/context';
import { NextResponse } from 'next/server';
import { getAnswer } from '@/actions/aigenerationtext';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const maxDuration = 30;

const aiModel = createOpenAI({ 
   apiKey: process.env.TOGETHER_API_KEY,
   baseURL: 'https://api.together.xyz/v1',
})

export async function POST(req: Request) {
  const { messages, fileKey, userId, id } = await req.json();

  if(!fileKey) return NextResponse.json({ error: "missing file key"}, { status: 404 });
  
  try {
    const lastMessage = messages[messages.length - 1];
    // const context = await getContext(lastMessage.content, fileKey);

    // console.log("CONTEXT", context);
    console.log('MESSAGE RECEIVED', messages);

    const result = streamText({ 
      model: aiModel("meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"),
      messages,
      system: `You are a helpful assistant. When users ask questions:
      1. First try to answer directly if it's a general question
      2. If the question is out of your knowledge base or seems specific to a document, use the getContextFromDocument tool to get relevant information
      3. After getting context, provide a natural response incorporating that information
      4. If no relevant information is found, respond with "I don't have enough information to answer that question."
      Always respond in a conversational manner, not in tool call format.`,
      tools: {
        getContextFromDocument: {
          description: "Get context from document. Use this tool when user asking questions related to the document embedded in the chat",
          parameters: z.object({
            question: z.string().describe("The question to answer")
          }),
          execute: async ({ question }) => {
            return await getContext(question, fileKey);
          }
        }
      },
      maxSteps: 3,
      maxTokens: 300,
      async onStepFinish({ stepType, response, text, toolCalls}) {
        // Handle step completion if needed
      },
      async onFinish({ response }) {
        await prisma.chats.createMany({
          data: [
            {
              id: lastMessage.id,
              user_id: userId,
              role: "user",
              content: lastMessage.content as string,
              document_id: id,
              created_at: response.timestamp,
            },
            {
              id: response.id,
              user_id: userId,
              role: response.messages[0].role,
              content: response.messages
                .flatMap((msg) => {
                  if (typeof msg.content === 'string') return msg.content;
                  if (Array.isArray(msg.content)) {
                    return msg.content
                      .filter((part): part is TextPart => part.type === 'text')
                      .map(part => part.text);
                  }
                  return '';
                })
                .join("\n"),
              document_id: id,
            },
          ],
        });
       
        //  console.log(
        //    "RESULTT",
        //    response.messages
        //    // @ts-ignore
        //      .flatMap((msg) => msg.content) // Flatten array of arrays
        //      // @ts-ignore
        //      .filter((part) => part.type === "text") // Optional: ensure type is 'text'
        //      // @ts-ignore
        //      .map((part) => part.text) // Extract just the text
        //      .join("\n")
        //  );
      }, 
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.log("ERROR", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


