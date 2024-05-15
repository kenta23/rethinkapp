"use server"

import { auth, signIn } from "@/auth";
import { getXataClient } from "../../src/xata"
import bcrypt from 'bcryptjs';
import { redirect } from "next/navigation";
import z from 'zod';
import { saltHashedPassword } from "@/lib/userAccountValidation";

const xata =  getXataClient();

export async function signup(formdata: FormData) {
    try {
        const formdataObj: { [key: string]: string} = {}

        for(const [key, value] of formdata.entries()) {
             formdataObj[key] = value as string
        }
        const formatUsernameString: string = formdataObj.username.trim();
        
        console.log(formdataObj);

       //check if user already exists in database
       const user = await xata.db.Credentials.filter({ username: formatUsernameString }).getFirst();
       
       if(user) {
           //CHECK IF USERNAME ALREAD EXISTS

           return { 
               message: "User already exists"
           }
       } 

      else {
        const hashedPassword = await bcrypt.hash(formdataObj.password, 10);

        await xata.db.Credentials.createOrUpdate({
           username: formatUsernameString,
           password: hashedPassword,
           secretcode: formdataObj.secretcode
        }).then(async val => {
          return {
              result: val
          }
        }).catch((error) => {
          return { result: error }
        })
      }
    } catch (error) {
        return { result: error }
    }
}

export async function signin(prevState: any, formdata: FormData) {
  const validateSchema = z.object({
    username: z.string({ invalid_type_error: 'Invalid Email'}).min(4, 'Username is required'),
    password: z.string({ required_error: "Password is requird", invalid_type_error: "Password is invalid"}).min(8, "Password must need atleast 8 characters long")
  }) 

  const username = formdata.get('username');
  const password = formdata.get('password');

  if (typeof username === 'string' && typeof password === 'string') {
 
    const validatedUser = validateSchema.safeParse({ username, password });

    if (validatedUser.success) {
        const newFormdata = new FormData;
        const { username, password } = validatedUser.data;
        formdata.append('username', username);
        formdata.append('password', password);
        
       await signIn('credentials', newFormdata).then(() => {
         redirect('/')
       }).catch(err => { return { message: err }}); 

    } else {
        return {
          message: validatedUser.error.flatten().fieldErrors
        } 
    }

} else {
    return {
       message: new Error()
    }
}
    return {
      message: 'Please enter a valid email',
    }
}

export async function changePassword (p: string) {

   const session = await auth();
   const userID = session?.user.id as string;
   const hashedPassword =  saltHashedPassword(p);
   let status:string = '';
  
   const existedUser = await xata.db.Credentials.filter('id', userID).getFirst();

   if(!existedUser) {
     throw new Error("Non existed user!");
   }

   try {
     await xata.db.Credentials.update(userID, { password: hashedPassword });
     status = 'Successfully updated password'

     console.log('Successful');
     return status;

   } catch (error) {
     console.log(error);
     return new Error('Error updating your password');
   }
}



