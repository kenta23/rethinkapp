import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import prisma from '../../lib/prisma';

export async function POST(req: Request) {
    const { id } = await req.json();
    const session = await auth();

  try {
    if(!session?.user) return NextResponse.json('User not Authenticated', { status: 401 })

    const res = await prisma.chats.findMany({ 
      where: { 
        document_id: id
      },
      orderBy: { created_at: 'asc' },
    })

    console.log('RESULTS', res)

    return NextResponse.json(res); 

  } catch (error) {
    console.log('SOME ERROR OCCURED', error)
    return NextResponse.json(error, { status: 500 })
  }
          
}