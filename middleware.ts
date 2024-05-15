//import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
/*const protectedRoute = createRouteMatcher([
  '/main/(.*)',
])

export default clerkMiddleware((auth, req) => {
    if(protectedRoute(req)) auth().protect()
});


export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}; */

 
import { auth } from '@/auth'
import { cookies } from 'next/headers';


export default auth((req) => {

   const getCookie = cookies();
   getCookie.get('user');

  
   if(req.nextUrl.pathname === '/change-password'){
      if(!getCookie.has('user')) {
          const url = req.url.replace(req.nextUrl.pathname, '/forgot-password');
          return Response.redirect(url);
      } 
   }
  
   
})
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

