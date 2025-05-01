import { HfInference } from "@huggingface/inference";
import { OpenAIApi, Configuration } from "openai-edge";
import { Pinecone } from '@pinecone-database/pinecone';

export const runtime = 'edge';


// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });


const config = new Configuration({
   apiKey: process.env.OPENAI_API_KEY_2,
 });
 
 const openai = new OpenAIApi(config); 
 
 export async function getEmbeddings(text: string) {
  //  try {
  //    const response = await openai.createEmbedding({
  //      model: "text-embedding-ada-002" ,
  //      input: text.replace(/\n/g, " "),
  //    });
  //    const result = await response.json();
  //    //console.log('RESULT FROM AI: ', result);
  //    return result.data[0].embedding as number[]; 
  //  } catch (error) {
  //    console.log("error calling openai embeddings api", error);
  //    throw error;
  //  }

  try {
    const embeddings = await pc.inference.embed(
      'multilingual-e5-large',
      data.map(d => d.text),
      { inputType: 'passage', truncate: 'END' }
    );

    return embeddings[0].data.values as number[];

  } catch (error) {
    console.log("Error embed text", error);
    throw error;
  }
}