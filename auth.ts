import NextAuth from 'next-auth'
import { XataAdapter } from '@auth/xata-adapter'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { ZodError } from 'zod'
import { compare } from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './app/lib/prisma'
import authconfig from './auth.config';

// const client = new XataClient();

export const { auth, handlers, signOut, signIn } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authconfig,
}); 
