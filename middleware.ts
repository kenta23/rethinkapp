// import { auth } from './auth';
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import { getToken } from 'next-auth/jwt'; 
import { NextResponse, NextRequest } from 'next/server';
import authConfig from './auth.config';
import NextAuth from "next-auth"
import { auth } from './auth';



export const { auth: middleware } = NextAuth(authConfig);


// export default async function middleware(req: NextRequest) {
//   const session = await auth(); // should only call JWT decoding, not Prisma

//   // Do not access Prisma or PrismaAdapter logic here
//   const getCookie = await cookies();

//   const user = getCookie.get("user")?.value;

//   if (req.nextUrl.pathname === "/change-password") {
//     if (!user) {
//       const url = req.url.replace(req.nextUrl.pathname, "/forgot-password");
//       return NextResponse.redirect(url);
//     }
//   }

//   if (req.nextUrl.pathname.startsWith("/main")) {
//     if (session?.user) {
//       return NextResponse.redirect("/projects");
//     }
//   }


//   // Add your custom middleware logic using session
//   return NextResponse.next();
// }


// const { auth: authMiddleware } = NextAuth(authconfig);

// export default authMiddleware(async (req) => {
//   // Your custom middleware logic goes here
//   const getCookie = await cookies();

//   const user = getCookie.get("user")?.value;

//   if (req.nextUrl.pathname === "/change-password") {
//     if (!user) {
//       const url = req.url.replace(req.nextUrl.pathname, "/forgot-password");
//       return NextResponse.redirect(url);
//     }
//   }

//   if (req.nextUrl.pathname.startsWith("/main")) {
//     if (req.auth?.user) {
//       return NextResponse.redirect("/projects");
//     }
//   }
// });

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

