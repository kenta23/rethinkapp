import GitHub from "next-auth/providers/github"
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from "next-auth"

 

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
      ],
} satisfies NextAuthConfig;