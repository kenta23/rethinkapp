import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './app/lib/prisma'
import authconfig from './auth.config';
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// const client = new XataClient();

export const { auth, handlers, signOut, signIn } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authconfig,
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = auth?.user;
      const cookieStore = await cookies();

      if (cookieStore.get('guest_user')?.value) { 
        const guestUserDeleted = await prisma.guestUser.delete({ 
           where: { 
            cookieId: cookieStore.get('guest_user')?.value
           }
        }) 
        if (guestUserDeleted) {
           return NextResponse.json("Guest user deleted", { status: 200 });
        }
      }
      if (isLoggedIn) {
        // Redirecting authenticated users to the projects if they attempt to access authentication-related pages like login/signup
        const alreadyAuthenticated =
          nextUrl.pathname === "/login" ||
          nextUrl.pathname === "/register" ||
          nextUrl.pathname === "/forgot-password" ||
          nextUrl.pathname === "/change-password";

        if (alreadyAuthenticated){ 
          return NextResponse.redirect(new URL("/projects", nextUrl));
        }     
       }
    },
  
    async jwt({ token, account, user, profile, trigger, session }) {
  
       if(trigger === 'update' && session) {
           return { ...token, ...session?.user }
       }
      if (user && account?.type === "oauth") {
        token.userId = user.id as string;
        token.provider = account?.provider as string;
      }
      if (user && account?.type === "oidc") {
        token.userId = user.id as string;
        token.provider = account?.provider as string;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session?.user) {
        session.user = {
          ...session.user,
          id: token.userId, //(3)
          provider: token.provider,
          name: token.name,
          image: token.picture,
        };
      }
      return session;
    },
}
}); 
