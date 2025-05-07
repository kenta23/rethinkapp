import GitHub from "next-auth/providers/github"
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from "next-auth"
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { ZodError } from "zod";
 

export default {
    providers: [
      Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,

        profile(profile) {
          return {
            id: profile.id.toString(),
            name: profile.name || profile.login,
            email: profile.email,
            image: profile.avatar_url,
            username: profile.login,
          };
        },
      }),
      Credentials({
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
      }),
      ],

      callbacks: {
        authorized({ auth, request: { nextUrl } }) {
          const isLoggedIn = auth?.user;
      
          // Determining if the user is currently on the main page
          const isOnMainpage = nextUrl.pathname.startsWith("/main/");
      
          // Handling authorization logic based on user status and location
          if (isOnMainpage) {
            // Redirecting unauthenticated users to the login page when attempting to access main-related pages
            if (isLoggedIn) {
              return true;
            }
            return false;
          } else if (isLoggedIn) {
            // Redirecting authenticated users to the projects if they attempt to access authentication-related pages like login/signup
            const alreadyAuthenticated =
              nextUrl.pathname === "/login" ||
              nextUrl.pathname === "/register" ||
              nextUrl.pathname === "/forgot-password" ||
              nextUrl.pathname === "/change-password";
            if (alreadyAuthenticated)
              return Response.redirect(new URL("/projects", nextUrl));
            return true;
          }
      
          return true;
        },
      
        async jwt({ token, account, user, profile, trigger, session }) {
      
           if(trigger === 'update' && session) {
               return { ...token, ...session?.user }
           }
         
          if (account && account.type === "credentials") {
            //(2)
            token.userId = account.providerAccountId; // this is Id that coming from authorize() callback
            token.provider = account?.provider as string;
            token.name = user.name as string
            token.picture = user.image
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
} satisfies NextAuthConfig;