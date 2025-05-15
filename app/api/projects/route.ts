import { auth } from "../../../auth";
import { NextResponse, NextRequest } from "next/server";
import { utapi } from "@/server/uploadthing";
import { Pinecone } from "@pinecone-database/pinecone";
import prisma from '../../lib/prisma';
import { getUserGuestSession } from "@/lib/getSession";


export async function GET() {
        const session = await auth();
        const guestUserData = await getUserGuestSession();

      if (!session?.user && !guestUserData) { 
          return NextResponse.json([], { status: 200 });
      }
 
      try {
          if (guestUserData && !session?.user) {
             return NextResponse.json(guestUserData.documents, { status: 200});
           }
       if (session?.user) { 
         const data = await prisma.user.findFirst({ 
            where: { 
               id: session?.user.id
            },
             include: {
               documents: true
             }
          })
         return NextResponse.json(data?.documents, { status: 200 });
       }

      } catch (error) {
         console.log('Error rendering data', error);
         return  NextResponse.json(error, { status: 400});
      }
}

{/**DELETING DOCUMENT */}
export async function POST (req: NextRequest) {

   const session = await auth();
   const checkGuestUser = await getUserGuestSession();

   const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
   const index = pinecone.Index("rethink");

   if(!session?.user || !checkGuestUser) {
      return NextResponse.json({ message: "User not authenticated"}, { status: 401 });
    }
   const { id } = await req.json();

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
      return NextResponse.json(data, { status: 200 });

   } catch (error) {
      console.log('Error rendering data', error);
      return  NextResponse.json(error, { status: 400 });
   }
}
