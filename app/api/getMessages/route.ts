import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import prisma from '../../lib/prisma';
import { getUserGuestSession } from "@/lib/getSession";


export async function POST(req: Request) {
    const { id } = await req.json();
    const session = await auth();
    const checkGuestUser = await getUserGuestSession();
  
    
   if(!id) {
      return NextResponse.json('No id provided', { status: 400 })
    }


  try {
    if (!session?.user && !checkGuestUser) { 
      return NextResponse.json('User not Authenticated', { status: 401 })
    }

  
   else if (checkGuestUser) { 
        const res = await prisma.documents.findMany({ 
           where: { 
            id,
            guest_user_id: checkGuestUser.id
           },
           include: { 
             chats: true
           },
           orderBy: { created_at: 'asc' },
        });
        return NextResponse.json(res[0]?.chats || [], { status: 200 })
    }
   else if(session?.user) { 
      const res = await prisma.documents.findMany({ 
        where: { 
          id,
        },
        select: { 
           chats: true
        },
        orderBy: { created_at: 'asc' },
      })
  
      return NextResponse.json(res[0]?.chats || [], { status: 200 }); 
     
    }
    else { 
       return NextResponse.json('Something went wrong', { status: 400 })
    }


  } catch (error) {
    console.log('SOME ERROR OCCURED', error)
    return NextResponse.json(error, { status: 500 })
  }
}