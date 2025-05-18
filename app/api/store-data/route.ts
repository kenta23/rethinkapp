import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { auth } from "../../../auth";
import { saveVectorToPinecone } from "@/lib/pinecone";
import prisma from '../../lib/prisma';
import { cookies } from "next/headers";
import { SignJWT } from 'jose';
import { randomUUID } from "crypto";
import { getUserGuestSession } from "@/lib/getSession";

const documentData = z.object({
   userId: z.string(),
   name: z.string(),
   url: z.string(),
   file_key: z.string(),
})

//storing document to the database
export async function POST(req: NextRequest) {
    const session = await auth();
    const cookieStore = await cookies();
    const guestUserData = await getUserGuestSession();

    const { url, file_key } = await req.json();

   async function createDocumentForGuest() {   
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

      const guestUser = await prisma.guestUser.create({
        //1. create guest user and store cookie id
        data: {
          cookieId: token,
          documents: {
            create: {
              name: file_key,
              file_link: url,
              file_key: file_key,
            }
          },
        },
        include: { 
           documents: { 
              select: {
                id: true,
                name: true,
                file_link: true,
                file_key: true,
              }
           }
        }
      });

      // const documentResult = await prisma.documents.create({
      //   data: {
      //     guest_user_id: guestUser.id,
      //     name: file_key,
      //     file_link: url,
      //     file_key: file_key, 
      //   }
      // });

    if (guestUser) { 
       if (guestUser.documents[0].file_key && guestUser.documents[0].file_link) {  //3. embed the document to pinecone
        const embeddedDocument = await saveVectorToPinecone(guestUser.documents[0].file_key); 
        console.log("Successfully created data to the database", embeddedDocument);  


        //store a cookie to the browser
        cookieStore.set('guest_user', guestUser.cookieId, { 
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });

          return NextResponse.json({ message: "Document created successfully", id: guestUser.documents[0].id }, { status: 200 });
        }    

        else { 
          return NextResponse.json({ message: "Failed to create document" }, { status: 500 });
        }
     }

    } catch (error) {
      console.error('Error generating token:', error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }

    if (!session?.user && !guestUserData) { //if the user is not logged in and the cookie is not set
       return await createDocumentForGuest();
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
           user_id: session?.user.id as string ?? null,
           guest_user_id: guestUserData?.id as string ?? null,
           name: file_key,
           file_link: url,
           file_key,
         }
       });

        console.log("Document created", result);

         if (result.file_key && result.file_link) {
             const embeddedDocument = await saveVectorToPinecone(result.file_key); 
             console.log("Successfully created data to the database", embeddedDocument);  

             return NextResponse.json({ message: "Document created successfully", id: result.id }, {status: 200})
          } else {
             return NextResponse.json({ message: "Failed to create document" }, { status: 500 });
          }    
       }

     catch(err) {
       console.log(err)
       return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
  }
}
