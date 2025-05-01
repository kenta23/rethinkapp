import { auth } from "../../../auth";
import { getXataClient } from "../../../src/xata";
import { NextResponse } from "next/server";
import { utapi } from "@/server/uploadthing";
import { Pinecone } from "@pinecone-database/pinecone";
import { revalidatePath } from "next/cache";
import prisma from '../../lib/prisma';


export async function GET() {
        const session = await auth();

        try {
           const data = await prisma.documents.findMany({ 
             where: { 
                user_id: session?.user.id,
             },
               orderBy: { 
                  updated_at: 'desc'
               }
           })
         
           return NextResponse.json(data, { status: 200});

        } catch (error) {
           console.log('Error rendering data', error);
           return  NextResponse.json(error, { status: 400});
        }
}

{/**DELETING DOCUMENT */}
export async function POST (req: Request, res: Response) {
   const xata = getXataClient();
   const session = await auth();

   const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
   const index = pinecone.Index("rethink");

   if(!session?.user) {
      return NextResponse.json({message: "User not authenticated"}, { status: 401 });
    }
   const { id } = await req.json();

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
      return NextResponse.json(data, { status: 200 });

   } catch (error) {
      console.log('Error rendering data', error);
      return  NextResponse.json(error, { status: 400 });
   }
}