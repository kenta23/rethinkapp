import { XataArrayFile } from "@xata.io/client"
import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";
import { JWT } from "next-auth/jwt";


export type savedDataDbType = {
  id: string;
  name: string;
  file_link: string | null | undefined;
  file_key: string | null;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}[] | null; 


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      provider: string | null
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    provider: string | null
  } 
}

export type User = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  provider?: string | null;
}