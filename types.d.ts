import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";
import { JWT } from "next-auth/jwt";


export type savedDataDbType = {
  id: string;
  name: string | null;
  user_id: string | null;
  guest_user_id: string | null;
  file_link: string | null;
  file_key: string | null;
  created_at: Date;
  updated_at: Date;
} | undefined; 


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