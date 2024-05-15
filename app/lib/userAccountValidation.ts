import React from 'react'
import z from 'zod'
import bcrypt, { genSaltSync } from 'bcryptjs'
 
export const UserAccountValidation = z.object({
  username: z.coerce
    .string({ required_error: "Username is required" })
    .min(8, "Email is required"),
  password: z.coerce
    .string({ required_error: "Password is required" })
    .min(8, "Password must be minimum of 8 characters")
    .max(32, "Password is too long"),
});


export function saltHashedPassword(password: string): string {
      const salt = genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt)

      return hash;
}