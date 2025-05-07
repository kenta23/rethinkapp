import { HfInference } from "@huggingface/inference";
import { OpenAIApi, Configuration } from "openai-edge";
import { EmbeddingsList, Pinecone } from '@pinecone-database/pinecone';

export const runtime = 'edge';


// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });


const config = new Configuration({
   apiKey: process.env.OPENAI_API_KEY_2,
 });
 
 const openai = new OpenAIApi(config); 
 
 export async function getEmbeddings(text: string) { //doc.pageContent
  try {
    const embeddings: EmbeddingsList = await pc.inference.embed(
      'llama-text-embed-v2',
      [text.replace(/\n/g, " ")], //removes multiple new lines
      { inputType: 'passage', truncate: 'END', } //1024 is the dimension of the embedding model
    );

    console.log('VALUESSS', embeddings); // Check the structure of the response

    //ignore type error
    // @ts-ignore
    return embeddings.data[0].values; //returns the embedding of the first text
  } catch (error) {
    console.log("Error embed text", error);
    throw error;
  }
}