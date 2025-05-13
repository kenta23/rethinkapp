import { auth } from "../../../auth";
import { NextResponse } from "next/server";
import { utapi } from "@/server/uploadthing";
import { Pinecone } from "@pinecone-database/pinecone";
import { revalidatePath } from "next/cache";
import prisma from '../../lib/prisma';
import { getUserGuestSession } from "@/lib/getSession";


export async function GET() {
        const session = await auth();
        const checkGuestUser = await getUserGuestSession();

      if (!session?.user && !checkGuestUser) { 
        return NextResponse.json([], { status: 200 });
      }

      try {
          if (checkGuestUser && !session?.user) {
            const data = await prisma.documents.findMany({ 
               where: { 
                  user_id: checkGuestUser?.cookieId
               },
                 orderBy: { 
                    updated_at: 'desc'
                 }
             })

             return NextResponse.json(data, { status: 200});
           }
       if (session?.user) { 
         const data = await prisma.documents.findMany({ 
            where: { 
               user_id: session?.user.id
            },
              orderBy: { 
                 updated_at: 'desc'
              }
          })
         return NextResponse.json(data, { status: 200 });
       }

      } catch (error) {
         console.log('Error rendering data', error);
         return  NextResponse.json(error, { status: 400});
      }
}

{/**DELETING DOCUMENT */}
export async function POST (req: Request, res: Response) {

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