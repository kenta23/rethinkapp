'use server';

import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import prisma from './prisma';
import { cookies } from "next/headers";

export async function getData(id: string) {
   //check if the user is a guest 
   const session = await auth();
   const cookieStore = await cookies();
   const guestUser = cookieStore.get("guest_user")?.value;
   
   // fetch the guest user from the db
   const guestUserFromDB = await prisma.guestUser.findFirst({ 
       where: { 
         cookieId: guestUser
       }
   });

     if (!session?.user && !guestUserFromDB?.cookieId) {
         return null;
     }
       const data = await prisma.documents.findMany({ 
         where: { 
             id,
             OR: [
                {user_id: session?.user?.id},
                {user_id: guestUserFromDB?.cookieId}
             ]
         }
       });

       console.log('DATA',data);
       return data;
}
