import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { auth } from "../../../auth";
import { saveVectorToPinecone } from "@/lib/pinecone";
import prisma from '../../lib/prisma';
import { cookies } from "next/headers";
import { SignJWT } from 'jose';
import { randomUUID } from "crypto";

const documentData = z.object({
   userId: z.string(),
   name: z.string(),
   url: z.string(),
   file_key: z.string(),
})

//storing document to the database
export async function POST(req: Request) {
    const session = await auth();
    const cookieStore = await cookies();

    const { url, file_key } = await req.json();

    if (!session?.user) {
      try {

          const generateToken = randomUUID();
          const secret = new TextEncoder().encode(process.env.JWT_SECRET);

          const token = await new SignJWT({ 
             jti: generateToken,
             aud: 'guest_user',
          })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d')
            .sign(secret);

        const guestUser = await prisma.guestUser.create({   //1. create guest user and store cookie id
             data: { 
               cookieId: token,
               documents: { 
                 create: { 
                  user_id: token,
                  name: file_key,
                  file_link: url,
                  file_key,
                 }
               }
             },
             include: { 
               documents: true
             }
          })

      if (guestUser) { 
        const documentResult = guestUser.documents[0];
         if (documentResult.file_key && documentResult.file_link) {  //3. embed the document to pinecone
              const embeddedDocument = await saveVectorToPinecone(file_key); 
              console.log("Successfully created data to the database", embeddedDocument);  

                         //store a cookie to the browser
          cookieStore.set('guest_user', guestUser.cookieId, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });

              return NextResponse.json(documentResult.id, { status: 200 });
           }    
       }

      } catch (error) {
        console.error('Error generating token:', error);
      }
    }

    else { 
      try
      {        
         documentData.safeParse({
          userId: session?.user.id as string,
          name: file_key,
          url,
          file_key
        })

        //store first the document data to the database
       const result = await prisma.documents.create({
         data: {
           user_id: session?.user.id as string,
           name: file_key,
           file_link: url,
           file_key,
         }
       });

        console.log("Document created", result);

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
}
