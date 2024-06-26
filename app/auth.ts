import NextAuth from 'next-auth'
import { XataClient } from '../src/xata'
import { XataAdapter } from '@auth/xata-adapter'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { ZodError } from 'zod'
import { compare } from 'bcryptjs';

const client = new XataClient();

export const { auth, handlers, signOut, signIn, unstable_update } = NextAuth({
  adapter: XataAdapter(client),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
   /* Github({
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
    }), */

    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        try {
          if (credentials) {
            const { username, password } = credentials as {
              username: string;
              password: string;
            };

            const userdata = await client.db.Credentials.filter({ 
              username: username,
            }).getFirst();

            console.log("USERDATA", userdata);
            const retrievePasswordfromDB = userdata?.password as string;
            console.log("PASSWORD", retrievePasswordfromDB);

            console.log("PASSWORD", credentials.password as string);

            const isPasswordMatch = await compare(
              credentials.password as string,
              retrievePasswordfromDB as string
            );
            

            if (!isPasswordMatch) {
              throw new Error("Invalid identifier or password");
            } else {
              //SUCCESSFULLY CREATED ACCOUNT
              console.log("credentials", credentials);
              return {
                email: userdata?.username,
                id: userdata?.id,
                name: userdata?.name || "",
                image: userdata?.image || "",
              };
            }
          } else {
            return null; // Return null if credentials are not provided
          }
        } catch (error) {
          if (error instanceof ZodError) {
            return error;
          } else {
            throw error;
          }
        }
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
  },
}); 