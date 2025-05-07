import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "../../../src/xata";
import { z } from 'zod';
import { auth } from "../../../auth";
import { saveVectorToPinecone } from "@/lib/pinecone";
import prisma from '../../lib/prisma';


// const xata = getXataClient();

const documentData = z.object({
   userId: z.string(),
   name: z.string(),
   url: z.string(),
   file_key: z.string(),
})

//storing document to the database
export async function POST(req: Request, res: Response) {
    const session = await auth();

    if(!session?.user) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }
     try
      {
          const { name, url, file_key } = await req.json();
        
          documentData.safeParse({
           userId: session.user.id as string,
           name: name,
           url: url,
           file_key: file_key
         })
           

         //store first the document data to the database
        const result = await prisma.documents.create({
          data: {
            user_id: session.user.id as string,
            name,
            file_link: url,
            file_key: file_key
          }
        })

         if (result.file_key && result.file_link) {
              const embeddedDocument = await saveVectorToPinecone(file_key); 

              console.log("Successfully created data to the database", embeddedDocument);  
              return NextResponse.json(result.id, {status: 200})
           }    
         }
      catch(err) {
        console.log(err)
        return NextResponse.json(err)
     }
}
