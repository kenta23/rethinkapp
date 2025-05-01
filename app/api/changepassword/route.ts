import { auth } from "@/auth";
import { saltHashedPassword } from "@/lib/userAccountValidation";
import { getXataClient } from "../../../src/xata";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const xata =  getXataClient();

export async function POST(req: Request, res: Response) {
    const { password } = await req.json();
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user')?.value;
  
    const hashedPassword =  saltHashedPassword(password);

    if(!userCookie) {
      return NextResponse.json({ message: "The session expired. Please try again" }, { status: 401 });
    }

    const existedUser = await xata.db.Credentials.filter('username', userCookie).getFirst();
 
    if(!existedUser) {
      throw new Error("Non existed user!");
    }
 
    try {
      const userID = existedUser.id;
      await xata.db.Credentials.update(userID, { password: hashedPassword });
 
      console.log('Successful');

      //delete cookie after 
      cookieStore.delete('user');

      return NextResponse.json({ message: 'Successfully updated password', username: existedUser.username }, { status: 200 });
 
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: 'Error updating your password'}, { status: 400 });
    }
}