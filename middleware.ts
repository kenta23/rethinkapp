import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt'; 
import { NextResponse, NextRequest } from 'next/server';
import authConfig from './auth.config';
import NextAuth from "next-auth"


const { auth: middleware } = NextAuth(authConfig);

export default middleware(async (req) => { 

  const { nextUrl } = req;
  const isLoggedIn =  req.auth;

  if (isLoggedIn) { 
    const cookieStore = await cookies();
    if(cookieStore.get("guest_user")?.value) { 
      cookieStore.delete("guest_user");
     }

   if(nextUrl.pathname === "/login") { 
      return NextResponse.redirect(new URL("/projects", nextUrl));
    }
  }
 });

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

