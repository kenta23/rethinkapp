'use server';

import { cookies } from "next/headers";
import prisma from "./prisma";


export async function getUserGuestSession () { 
    const cookieStore = await cookies();
    const guestUser = cookieStore.get('guest_user')?.value;

    //fetch the guest user from the db
    const guestUserFromDB = await prisma.guestUser.findFirst({ 
        where: { 
            cookieId: guestUser
        }
    });
    return guestUserFromDB;
}