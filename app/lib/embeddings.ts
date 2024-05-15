import { HfInference } from "@huggingface/inference";
import { OpenAIApi, Configuration } from "openai-edge";

export const runtime = 'edge';

const config = new Configuration({
   apiKey: process.env.OPENAI_API_KEY_2,
 });
 
 const openai = new OpenAIApi(config); 
 
 export async function getEmbeddings(text: string) {
   try {
     const response = await openai.createEmbedding({
       model: "text-embedding-ada-002" ,
       input: text.replace(/\n/g, " "),
     });
     const result = await response.json();
     //console.log('RESULT FROM AI: ', result);
     return result.data[0].embedding as number[]; 
   } catch (error) {
     console.log("error calling openai embeddings api", error);
     throw error;
   }
}