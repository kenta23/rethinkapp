import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getXataClient } from "../../../src/xata";
import { saltHashedPassword } from "@/lib/userAccountValidation";

const xata = getXataClient();


export async function POST (req: Request) {
    const session = await auth();

    if(!session?.user) {
        return NextResponse.json({ message: "Failed to update profile"}, { status: 401 });
    }
 
    try {
      const { username, password, firstName, lastName } = await req.json();

      const validatingPassword = password as string;
     
      let data;
       
      if(validatingPassword.length) {
        const hashedPassword = saltHashedPassword(password);
        data = await xata.db.Credentials.update(session?.user.id as string,
            {
              name: firstName + " " + lastName,
              password: hashedPassword,
            }
          );
      }
      else {
        data = await xata.db.Credentials.update(session?.user.id as string,
            {
              name: firstName + " " + lastName,
            }
          );
      }

      if (data) {
        return NextResponse.json(
          { message: "Successfully updated your Profile" },
          { status: 200 }
        );
      }

      console.log("FROM API: ", username, password, firstName, lastName);
    } catch (error) {
      return NextResponse.json(
        { message: "Something went error" },
        { status: 400 }
      );
    }
}