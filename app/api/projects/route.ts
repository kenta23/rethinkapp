import { auth } from "../../../auth";
import { NextResponse, NextRequest } from "next/server";
import { utapi } from "@/server/uploadthing";
import { Pinecone } from "@pinecone-database/pinecone";
import prisma from '../../lib/prisma';
import { getUserGuestSession } from "@/lib/getSession";

// Define common document fields to avoid repetition
const documentFields = {
    id: true,
    name: true,
    file_key: true,
    created_at: true,
    updated_at: true,
    file_link: true,
    chats: true,
};

export async function GET() {
  try {
    const session = await auth();
    const guestUserData = await getUserGuestSession();

    // Check authentication
    if (!session?.user && !guestUserData) {
      return NextResponse.json([], { status: 200 });
    }

    let documents;

    if (guestUserData) {
      documents = guestUserData.documents;
    } else if (session?.user) {
      const userData = await prisma.user.findFirst({
        where: {
          id: session.user.id,
        },
        include: {
          documents: {
            orderBy: {
              updated_at: "desc",
            },
            select: {
              ...documentFields,
              user_id: true,
            },
          },
        },
      });
      documents = userData?.documents || [];
    }

    return NextResponse.json(documents, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
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
