'use client'

import { signup } from '@/actions/account';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler  } from 'react-hook-form'
import { toast } from 'sonner';

interface signupInputs {
    username: string,
    password: string, 
    confirmPassword: string,
    secretCode: string
}

export default function Signup() {
    const router = useRouter();
    const {register, getValues, setValue, handleSubmit, reset, formState: {
        errors,
        isSubmitting
    },  } = useForm<signupInputs>({
            defaultValues: {
                username: '',
                password: '',
                secretCode: ''
            },
            
    })
    const [strformat, setStrformat] = useState<string>('');
    const handleFormatStr = (s: string) => {
      setStrformat(s.replace(/\s/g, ""));
      console.log(strformat);
    }
    const { mutateAsync, data: newdata, isError, isPending } = useMutation({
      mutationFn: async (formdata: FormData) => await signup(formdata),
    }) 
  
    useEffect(() => {
      setValue('secretCode', strformat); 
    }, [strformat, setValue]); 
    

    const onSubmit: SubmitHandler<signupInputs> = async (data) => {
            setValue('secretCode', strformat, {
                shouldValidate: true,
            })
            const formdata = new FormData();
          
            formdata.append('username', data.username); 
            formdata.append('password', data.password);
            formdata.append('secretcode', data.secretCode);
            
          // const res = await signup(formdata);

          mutateAsync(formdata, {
             onError: () => {
               toast.error("Something went error");
             }
          })  
             /* await signIn('credentials', {
                 username: newdata?.result?.username,
                 password: data.confirmPassword as string
              }) */
              console.log(data);
      }

      useEffect(() => {
         if(isPending) {
           toast.info("Please wait")
         } 
         if(isError) {
           toast.error("Something went wrong");
         }
         if(newdata?.error) { 
          toast.error("Account username already existed");
        }
        if(newdata?.result) {
            toast.success("Successfully created your account please try to login again");
            router.push('/');
        }
      }, [isPending, isError, newdata, router]);
      


  return (
    <div className="mt-[30px] px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-3 items-start flex-col">
          <Input
            {...register("username", {
              required: "Username is required",
              maxLength: {
                value: 30,
                message: "Username cannot exceed 30 characters",
              },
              minLength: {
                value: 8,
                message: "Username must be at least 8 characters long",
              },
            })}
            className=""
            placeholder="Username"
          />
          {errors.username && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.username.message}
            </p>
          )}
          <Input
            className=""
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />

          {errors.password && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}

          <Input
            className=""
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Password is required",
              validate: {
                matchesPreviousPassword: (value) => {
                  const password = getValues("password");
                  return password === value || "Passwords do not match";
                },
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />

          {errors.confirmPassword && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          ) }

        <Label 
           className='text-sm text-gray-500'>
            <span className='text-sm font-normal leading-snug'>Your first name and the date of your birthday plus your current age</span>
        </Label>
          <Input
            className=""
            type="text"
            placeholder="Secret code" //rusty2322
            value={strformat}
            onChange={(e) => handleFormatStr(e.target.value)}
          /> 

          {errors.secretCode && (
            <p role="alert" className="text-red-500 text-sm">
              {errors.secretCode.message}
            </p>
          )}
        </div>

        <Button
          className="w-full h-[45px] bg-primaryColor "
          type="submit"
          aria-placeholder="Log in"
          aria-disabled={isSubmitting} 
        >
          <span>Sign up</span>
        </Button>
      </form>
    </div>
  );
}
