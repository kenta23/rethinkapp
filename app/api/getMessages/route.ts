import { NextResponse } from "next/server";
import { getXataClient } from "../../../src/xata";
import { auth } from "@/auth";

const xata = getXataClient();

export async function POST(req: Request) {
    const { id } = await req.json();
    const session = await auth();
  try {

    if(!session?.user) return NextResponse.json('User not Authenticated', { status: 401 })

    const res = await xata.db.chats.filter('document_id', id).sort('xata.createdAt', 'asc').getAll();

    return NextResponse.json(res); 

  } catch (error) {
    console.log('SOME ERROR OCCURED', error)
    return NextResponse.json(error, { status: 500 })
  }
          
}