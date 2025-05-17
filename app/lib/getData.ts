'use server';

import { Turret_Road } from 'next/font/google';
import { auth } from '../../auth';
import prisma from './prisma';
import { cookies } from "next/headers";
import { getUserGuestSession } from './getSession';


export async function getData(id: string) {
   // Check if the user is a guest 
   const session = await auth();
   const cookieStore = await cookies();
   const guestUser = cookieStore.get("guest_user")?.value;
   
   // Fetch the guest user from the db
   const guestUserFromDB = await getUserGuestSession();

   if (!session?.user && !guestUserFromDB?.cookieId) {
       return null;
   } else {
      const data = await prisma.documents.findFirst({ 
        where: { 
            id,
            OR: [
               { user_id: session?.user?.id },
               { guest_user_id: guestUserFromDB?.id }
            ]
        },
        include: { 
         chats: true,
         user: true,
         guestUser: true
        }
      });

      console.log('DATA', data);

      return data;
   } 
}  

