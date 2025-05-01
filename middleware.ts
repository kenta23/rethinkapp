// import { auth } from './auth';
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import { getToken } from 'next-auth/jwt'; 
import { NextResponse, NextRequest } from 'next/server';
import authconfig from './auth.config';
import NextAuth from "next-auth"


const { auth: authMiddleware } = NextAuth(authconfig);

export default authMiddleware (async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
})


// export { auth as middleware } from "./auth";

// export async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.AUTH_SECRET });

//   if (req.nextUrl.pathname === "/change-password" && !token) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/forgot-password";
//     return NextResponse.redirect(url);
//   }

//   if (req.nextUrl.pathname.startsWith("/main") && !token) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/projects";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

/*export default auth((req) => {

   const getCookie = (cookies() as unknown as UnsafeUnwrappedCookies);
   getCookie.get('user');

  
   if(req.nextUrl.pathname === '/change-password'){
      if(!getCookie.has('user')) {
          const url = req.url.replace(req.nextUrl.pathname, '/forgot-password');
          return Response.redirect(url);
      } 
   }
    if((req.nextUrl.pathname.startsWith('/main'))) {
      if(!req.auth?.user) {
         return Response.redirect('/projects')
      }
    } 
}) */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

