import OpenAI from "openai";
import { getXataClient } from "../../src/xata";


const openai = new OpenAI({
   apiKey: process.env.TOGETHER_API_KEY,
   baseURL: 'https://api.together.xyz/v1',
 }); 

export async function getData(id: string) {
   const xata = getXataClient();
   const data = await xata.db.document.filter('id', id).getFirst() //filtering the data using id or slug
   return data;
}
