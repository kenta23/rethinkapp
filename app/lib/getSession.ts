'use server';

import { cookies } from "next/headers";
import prisma from "./prisma";


export async function getUserGuestSession () { 
    const cookieStore = await cookies();
    const guestUser = cookieStore.get('guest_user')?.value;
    
    // Return null if no guest user cookie exists
    if (!guestUser) {
        return null;
    }

    //fetch the guest user from the db
     const res = await prisma.guestUser.findFirst({ 
        where: { 
            cookieId: guestUser,
        },
        include: { 
            documents: { 
                 orderBy: {
                    updated_at: 'desc'
                 },
                 select: { 
                     id: true,
                     name: true,
                     updated_at: true,
                     created_at: true,
                     file_key: true,
                     file_link: true,
                     guest_user_id: true,
                     chats: true
                 }
            },
            
        },
    });

    console.log('res',res);
    return res;
}