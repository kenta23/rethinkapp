"use server"

import { auth } from "@/auth";
import { getXataClient } from "../../src/xata";
import { NextResponse } from "next/server";
import { utapi } from "@/server/uploadthing";
import { Pinecone } from "@pinecone-database/pinecone";


export async function getProjects() {
        const xata = getXataClient();
        const session = await auth();

        if(!session?.user) {
            return {
                message: "User not authenticated"
            }
        }

        try {
           const data = await xata.db.document.filter({
               user_id: session?.user.id,
           }).sort('xata.updatedAt', 'desc').getAll();
      
           return NextResponse.json(data, { status: 200});

        } catch (error) {
           console.log('Error rendering data', error);
           return  NextResponse.json(error, { status: 400});
        }
}

{/**DELETING DOCUMENT */}
export async function deleteProject (id: string) {
   const xata = getXataClient();
   const session = await auth();

   const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
   const index = pinecone.Index("rethink");

   if(!session?.user) {
      return {
        message: "User not authenticated"
      };
    }

   try {
      const data = await xata.db.document.delete(id as string);

      if(data) {
         //DELETE FILE FROM UPLOADTHING
         await utapi.deleteFiles(data?.file_key as string);
 
         //DELETE EMBEDDINGS FROM PINECONE
        if(index.namespace(data?.file_key as string)) { 
           const namespaceVector =  index.namespace(data?.file_key as string).listPaginated();
           const hasVectors = (await namespaceVector).vectors;


           if(hasVectors) {
             await index.namespace(data?.file_key as string).deleteAll(); //delete all vectors associated in one namespace
             console.log('DELETED EMBEDDINGS');
           }
       } 
      }

      return {
        message: `Successfully deleted ${data?.name}`
      }

   } catch (error) {
      console.log('Error rendering data', error);
      return {
        message: `Something went error ${error}`
      }
   }
}