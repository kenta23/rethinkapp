"use server"

import { auth } from "../../auth";
import { NextResponse } from "next/server";
import { utapi } from "@/server/uploadthing";
import { Pinecone } from "@pinecone-database/pinecone";
import prisma from "@/lib/prisma";
import { z } from "zod";


{/**GETTING ALL THE DOCUMENTS */}

export async function getAllDocuments() {
   const session = await auth();

   try {
      const data = await prisma.documents.findMany({
         where: { 
             user_id: session?.user.id,
         },
        orderBy: { 
          updated_at: 'desc'
        }
      });

 
      return JSON.stringify(data); 

   } catch (error) {
      console.log('Error rendering data', error);
      return  {
          error: error
      }
   }
}

{/**EDITING THE PROJECT */}
export async function editProject(name: string, id: string) { 
   const session = await auth();

   if(!session?.user) {
      return {
         message: "User not authenticated"
      }
   }

   try {
      const data = await prisma.documents.update({
         where: { id },
         data: { name }
      })

      return data;
   }

   catch(err) { 
       if(err) { 
          return err;
       }
   }
}

{/**UPDATING DOCUMENT NAME */}
export async function changeName(formdata: FormData) {
     const session = await auth();
     const id = formdata.get("id") as string;
     const newName = formdata.get('newName') as string;
     
     if (!session?.user) {
      return { message: "User not authenticated" }
     }


     if (!id || !newName) {
        return { message: "Invalid input data" };
    }
 
     try {  
        await prisma.documents.update({ 
            where: { id },
            data: { name: newName }
        })

       return {
          message: "Successfully updated document"
       }
     }
     catch(err) {
       return {
          message: err
       }
     }
 }
 
 
{/**DELETING DOCUMENT */}
export async function deleteProject (id: string) {
   const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
   const index = pinecone.Index("rethink");
   const session = await auth();


   if(!session?.user) {
      return {
        message: "User not authenticated"
      };
    }

   try {
      const data = await prisma.documents.delete({
         where: { id }
      });

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