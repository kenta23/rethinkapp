'use client'

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm, SubmitHandler  } from 'react-hook-form'
import { toast } from 'sonner';
import Link from 'next/link';


interface inputTypes {
  username: string,
  password: string     
}

export default function CredentialForm() {
    const router = useRouter();
    const {register, handleSubmit, reset, formState: {
        errors,
        isSubmitting,
        isLoading
    },  } = useForm<inputTypes>({
            defaultValues: {
                username: '',
                password: ''
            }
    })
    const [loginstatus, setLoginStatus] = useState<string>('');


    const onSubmit: SubmitHandler<inputTypes> = async (data) => {
      reset();
      const { username, password } = data;

      try {
        const response: any = await signIn("credentials", {
          redirect: false,
          password: password,
          username: username,
        });
        if (response?.error) {
           setLoginStatus("Invalid username or password");
           toast.error("Invalid username or password");
        }
         else {
          router.push("/");
          router.refresh();
            // Process response here
          console.log("Login Successful", response);
          toast.success("Login Successful");
         }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      
      } catch (error: any) {
        console.error("Login Failed:", error);
        toast.error("Login Failed", { description: error.message });
      }
    }
      
  return (
    <div className="mt-[30px] px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-3 items-start flex-col">
          <Input
            {...register("username", 
             { required: "Username is required", 
              maxLength: { value: 20, message: "Username cannot exceed 20 characters" }, 
              minLength: { value: 8, message: "Username must be at least 8 characters long" } 
            })}
            className=""
            placeholder="Username"
          />
          {errors.username && 
            <p role="alert" className="text-red-500 text-sm">
              {errors.username.message}
            </p> 
          }
          <Input
            className=""
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters long" } })}

          />

         {errors.password && 
            <p role="alert" className="text-red-500 text-sm">
              {errors.password.message}
            </p> 
          }
        </div>

        <div className='flex items-end gap-2 w-full'>
             <Link href={'/forgot-password'} className='self-end'>
                <p className='text-purple-600 hover:text-purple-300 hover:underline duration-150 ease-in-out transition-colors text-sm'>Forgot Password</p>
             </Link>
        </div>
        <Button
          className="w-full h-[45px] bg-secondaryColor "
          type="submit"
          disabled={isLoading || isSubmitting}
          aria-placeholder="Log in"
        >
          <span>Log in</span>
        </Button> 
      </form>
      {<p className='text-red-500 mt-2 text-sm'>{loginstatus}</p>}
    </div>
  );
}
