"use server"


import { generateText, tool } from 'ai';
import { getContext, getContextForAIquestions } from '@/lib/context';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';



const aiModel = createOpenAI({ 
  apiKey: process.env.TOGETHER_API_KEY!,
  baseURL: 'https://api.together.xyz/v1',
})

export async function getAnswer(question: string) {
    const { text, finishReason, usage } = await generateText({
      model: aiModel("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
      maxTokens: 200,
      temperature: 0.4,
      system: question,
      prompt: "Give me some questions for this context"
    });
  
    return { text, finishReason, usage };
}

export async function getSuggestionContext(file_key: string | null) {
  if (!file_key) {
    throw new Error("File key is required");
  }

  try {
    const context = await getContextForAIquestions(file_key);

    const { text, finishReason, usage } = await generateText({
      model: aiModel("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
      maxTokens: 200,
      temperature: 0.4,
      maxRetries: 3,
      prompt: `Based on this context: "${context}"
Generate exactly 3 questions. Format your response as a simple numbered list of questions only, without any additional text or explanations.

Example format:
1. Question one?
2. Question two?
3. Question three?`,
      system: `You are a helpful assistant that creates concise, relevant questions. Respond with only the numbered questions, no additional text or explanations.`,
    });

    if (!text) {
      throw new Error("Failed to generate questions");
    }

    // Clean up the response to ensure we only get the questions
    const cleanText = text
      .split('\n')
      .filter(line => line.match(/^\d+\./)) // Only keep lines that start with a number and dot
      .join('\n')
      .trim();

    return { text: cleanText, finishReason, usage };

  } catch (error) {
    console.error("Error generating suggestions:", error);
    throw error;
  }
}

