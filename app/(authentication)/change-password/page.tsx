
"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { Check } from 'lucide-react'


interface inputsType {
    password: string, 
    confirmPassword: string,
}
export default function ChangePassword() {
    const [status, setStatus] = useState<string>('');
    const router = useRouter();
    const { reset, handleSubmit, register, getValues, formState: {
        errors, 
        isSubmitting,
        isLoading
    } } = useForm<{
        password: string,
        confirmPassword: string
    }>({
        defaultValues: {
             password: '',
             confirmPassword: ''
        }
    })

    const submitData: SubmitHandler<inputsType> = async (data) => {
        try {
            const res = await axios.post('/api/changepassword', {
                password: data.confirmPassword,
           }, {
               headers: {
                   "Content-Type": 'application/json'
               }
           })
           setStatus(res.data.message);

           toast.success("Successfully updated your account. Please relogin");
           router.push('/projects');
      
        } catch (error) {
            setStatus(error as string);
        }
         reset(data);
    }


  return (
    <div className="w-full h-full min-h-screen flex justify-center place-items-center">
      <Card className="px-4 py-2 text-center ">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription className="flex gap-2 items-center">
            <Check className='text-green-500' size={24}/>
            <span>Successful! you can now change your password</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(submitData)}
            className="flex flex-col w-full gap-3 items-center"
          >
            <div className="flex flex-col w-full gap-2">
              <Input
                type='password'
                placeholder="Password"
                required
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
                placeholder="Confirm Password"
                type='password'
                {...register("confirmPassword", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  validate: {
                    matchesPreviousPassword: (value) => {
                      const password = getValues("password");
                      return password === value || "Passwords do not match";
                    },
                  },
                })}
                required
              />
              {errors.confirmPassword && (
                <p role="alert" className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              <p>Submit</p>
            </Button>
          </form>
          {status && <p role="alert" className="text-gray-500 text-sm">{status}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
