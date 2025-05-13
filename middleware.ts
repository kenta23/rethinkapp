import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import { getToken } from 'next-auth/jwt'; 
import { NextResponse, NextRequest } from 'next/server';
import authConfig from './auth.config';
import NextAuth from "next-auth"


const { auth: middleware } = NextAuth(authConfig);

export default middleware(async (req: NextRequest) => { 

  const { nextUrl } = req;
  const isLoggedIn = await req.auth;

  if (isLoggedIn) { 
    const cookieStore = await cookies();
    cookieStore.delete("guest_user");
   if (nextUrl.pathname === "/login") { 
      return NextResponse.redirect(new URL("/projects", nextUrl));
   }
  }

    if (!isLoggedIn) { 
      if (nextUrl.pathname !== "/login") { 
        return NextResponse.redirect(new URL("/login", nextUrl));
      }
    }
 });

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

