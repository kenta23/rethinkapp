import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import prisma from '../../lib/prisma';
import { cookies } from "next/headers";
import { getUserGuestSession } from "@/lib/getSession";

export async function POST(req: Request) {
    const { id } = await req.json();
    const session = await auth();
    const checkGuestUser = await getUserGuestSession();
    

  try {
    if (!session?.user && !checkGuestUser) { 
      return NextResponse.json('User not Authenticated', { status: 401 })
    }

    if(!id) {
      return NextResponse.json('No id provided', { status: 400 })
    }

    const res = await prisma.chats.findMany({ 
      where: { 
        document_id: id
      },
      orderBy: { created_at: 'asc' },
    })


    return NextResponse.json(res, { status: 200 }); 

  } catch (error) {
    console.log('SOME ERROR OCCURED', error)
    return NextResponse.json(error, { status: 500 })
  }
}