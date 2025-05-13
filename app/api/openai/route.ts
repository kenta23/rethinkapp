import { Message, streamText, tool, TextPart } from 'ai'; 
import { getContext } from '@/lib/context';
import { NextResponse } from 'next/server';
import { getAnswer } from '@/actions/aigenerationtext';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


const aiModel = createOpenAI({ 
   apiKey: process.env.TOGETHER_API_KEY!,
   baseURL: 'https://api.together.xyz/v1',
})

export async function POST(req: Request) {
  const { messages, fileKey, userId, id } = await req.json();

  if(!fileKey) return NextResponse.json({ error: "missing file key"}, { status: 404 });
  
  try {
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);


    console.log('MESSAGE RECEIVED', messages);

    const result = streamText({ 
      model: aiModel("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
      messages,
      maxSteps: 3,
      maxTokens: 300,
      temperature: 0.4,
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
      }, 
      system: `You are a helpful assistant. When users ask questions:
      1. First try to answer directly if it's a general question
      2. If the question is out of your knowledge base or seems specific to a document, use the getContextFromDocument tool to get relevant information
      3. After getting context, read the context carefully. provide a natural response incorporating that information
      4. If user wants to ask a question or summarize the context, do it with the guide of tool call
      5. If no relevant information is found, respond with "I don't have enough information to answer that question."
      Always respond in a conversational manner, not in tool call format.`,
      tools: {
        getContextFromDocument: tool({
            description: "Get context from document. Use this tool when user asking questions related to the document embedded in the chat",
            parameters: z.object({
              question: z.string().describe("The question to answer")
            }),
            execute: async ({ question }) => {
              return await getContext(question, fileKey);
            }
          }
        )
      }
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.log("ERROR", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


