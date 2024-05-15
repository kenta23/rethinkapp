"use server"

import { getXataClient } from "../../src/xata";
import { auth } from "@/auth";

const xata = getXataClient();


export async function updateProfileAvatar(imagelink: string) {
  const session = await auth();

  if(!session?.user) {
    throw new Error ("Unauthorized user");
  }
   try {
      const res = xata.db.Credentials.update(session.user.id as string, {
         image: imagelink
      })

      if(res){
        return res;
      }

   } catch (error) {
      throw new Error("Something went error");
   }     
}
