"use server"


import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getContext } from '@/lib/context';


export async function getAnswer(question: string) {
    const { text, finishReason, usage } = await generateText({
      model: openai('gpt-3.5-turbo'),
      maxTokens: 200,
      temperature: 0.4,
      system: question,
      prompt: "Give me some questions for this context"
    });
  
    return { text, finishReason, usage };
}

export async function getSuggestionContext(file_key: string | null) {

      const prompt = "Give me some question about this context";
      const context: string = await getContext(prompt, file_key as string);

      const { text, finishReason, usage } = await generateText({
        model: openai("gpt-3.5-turbo"),
        maxTokens: 200,
        temperature: 0.4,
        system: `I provided a context for you to suggest me some question whatever you find in the context that may only
        related to the context, give me just 3 examples of questions and don't give a random or nonsense questions.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
        `,
        prompt: "Give me some questions for this context"
      });

      return { text, finishReason, usage };
}

