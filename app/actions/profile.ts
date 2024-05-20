"use server"

import { utapi } from "@/server/uploadthing";
import { getXataClient } from "../../src/xata";
import { auth, unstable_update as update } from "@/auth";


const xata = getXataClient();


export async function updateProfileAvatar(imagelink: string, fileKey: string) {
  const session = await auth();
  const xata = getXataClient();

  
  if(!session?.user) {
    throw new Error ("Unauthorized user");
  }
   try {
      //DELETE THE IMAGEURL ON UPLOADTHING FIRST
      const user = await xata.db.Credentials.readOrThrow(session.user.id);
      let data;

      if(user.fileKey) {
         data = await utapi.deleteFiles(user?.fileKey as string);
      }

      console.log("Data deleted", data);

      const res = await xata.db.Credentials.createOrUpdate(session.user.id as string, {
          image: imagelink,
          fileKey
        })

        if(res) {

         await update({
            ...session.user, 
            user: {
               ...session.user,
               image: res.image,
               provider: "credentials"
            }
         })
         return res.image; 
       } 

       return null;

   } catch (error) {
      throw new Error("Something went error");
   }     
}
