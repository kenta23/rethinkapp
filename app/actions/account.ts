"use server"

import { auth, signIn, signOut } from "@/auth";
import { getXataClient } from "../../src/xata"
import bcrypt from 'bcryptjs';
import { redirect } from "next/navigation";
import z from 'zod';
import { saltHashedPassword } from "@/lib/userAccountValidation";
import { utapi } from "@/server/uploadthing";
import { Pinecone } from "@pinecone-database/pinecone";

const xata = getXataClient();

interface SignupForm {
  username: string;
  password: string;
  secretcode: string;
}

export async function signup(formdata: FormData) {
  try {
    console.log(formdata);
    const username = formdata.get('username')?.toString() || "";
    const password = formdata.get('password')?.toString() || "";
    const secretcode = formdata.get('secretcode')?.toString() || "";

    if (!username || !password || !secretcode) {
      return { message: "All fields are required" };
    }

    const formattedUsername: string = username.trim();

    // Check if user already exists in the database
    const user = await xata.db.Credentials.filter('username', formattedUsername).getFirst();

    if (user) {
      return { result: null, message: 'Error creating user', error: "Username already exists" };
    }

    const hashedPassword = saltHashedPassword(password);

    const newUser = await xata.db.Credentials.createOrUpdate({
      username: formattedUsername,
      password: hashedPassword,
      secretcode: secretcode,
    });

    return {
      result: newUser,
      message: "User successfully created",
    };
  } catch (error) {
    console.error("Error during signup:", error);
    return { result: null, message: 'Error creating user', error: error };
  }
}

export async function changePassword (p: string) {

   const session = await auth();
   const userID = session?.user.id as string;
   const hashedPassword =  saltHashedPassword(p);
   let status:string = '';
  
   const existedUser = await xata.db.Credentials.filter('id', userID).getFirst();

   if(!existedUser) {
     throw new Error("Non existed user!");
   }

   try {
     await xata.db.Credentials.update(userID, { password: hashedPassword });
     status = 'Successfully updated password'

     console.log('Successful');
     return status;

   } catch (error) {
     console.log(error);
     return new Error('Error updating your password');
   }
}

const deleteUserData = async (userId: string) => {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!, 
  });

  const pineconeIndex = pinecone.index("rethink");
  const xata = getXataClient();

  try {
    const user = await xata.db.Credentials.filter('id', userId).getFirst();

    if (user) {
      // Delete profile avatar on uploadthing
      if (user.fileKey) {
        await utapi.deleteFiles(user.fileKey as string);
      }

      // Clear all documents associated with user
      const userDocuments = await xata.db.document.filter("user_id", userId).getAll();
      const userChats = await xata.db.chats.filter("user_id", userId).getAll();

      // Collect all document IDs to delete
      const userDocIds = userDocuments.map((doc) => doc.id);
      const userChatIds = userChats.map((chats) => chats.id);

      // Collect document file keys
      const userDocFileKeys = userDocuments.map((file) => file.file_key);

      // Delete all documents
      if (userDocIds.length > 0) {
        await xata.db.document.delete(userDocIds);
      }

      // Delete all chats
      if (userChatIds.length > 0) {
        await xata.db.chats.delete(userChatIds);
      }

      // Delete document embeddings on Pinecone
      for (const fileKey of userDocFileKeys) {
        if (pineconeIndex.namespace(fileKey as string)) {
          const namespaceVector = pineconeIndex.namespace(fileKey as string).listPaginated();
          const hasVectors = (await namespaceVector).vectors;

          if (hasVectors) {
            await pineconeIndex.namespace(fileKey as string).deleteAll(); // Delete all vectors associated with one namespace
            console.log("DELETED ALL EMBEDDINGS");
          }
        }
      }

      // Delete user credentials
      await xata.db.Credentials.delete(userId);
    }
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw new Error("An error occurred while deleting your account.");
  }
};

export async function deleteAccount() {
  const session = await auth();
  
  if (!session) throw new Error("Unauthenticated user!");

  await deleteUserData(session.user.id as string);

  // Sign out the user and redirect
  await signOut();
  return redirect('/');
}



