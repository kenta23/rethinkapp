'use client'


import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm } from 'react-hook-form';
import {  Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage, } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from "next/image";
import { X, ChevronLeft } from "lucide-react";
import { Session } from "next-auth";
import axios from "axios";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import { updateProfileAvatar } from "@/actions/profile";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAccount } from "@/actions/account";
import { AlertDescription } from '@/components/ui/alert';



const FormSchema = z
  .object({
    username: z
      .string({ required_error: "Username is required" })
      .min(8, { message: "Username must be at least 8 characters long." })
      .max(30, { message: "Username cannot exceed 30 characters long" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .optional()
      .or(z.literal('')), // allows empty string
    confirmPassword: z
      .string()
      .optional()
      .or(z.literal('')), // allows empty string
    firstName: z
      .string()
      .min(4, { message: "First name must be at least 4 characters long" })
      .optional()
      .or(z.literal('')), // allows empty string
    lastName: z
      .string()
      .min(4, { message: "Last name must be at least 4 characters long" })
      .optional()
      .or(z.literal('')), // allows empty string
  })
  .refine((data) => {
    if (data.password && data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // specify the path of the error
  });

export default function ProfileSetting({ session }: { session: Session | null}) {
    const {  update } = useSession();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');
    const router = useRouter();
    const imageUrl = session?.user.image ? session?.user.image : "/empty user.jpg";
    
    const { mutateAsync, data, isError, isPending, isSuccess } = useMutation({
       mutationFn: async (data:  z.infer<typeof FormSchema>) => await axios.post('/api/profile', data)
    })
    const {data: deleteData } = useMutation({
       mutationFn: deleteAccount,

    })

    const form = useForm({
         resolver: zodResolver(FormSchema),
         defaultValues: {
             username: session?.user.email as string,
             password: '',
             confirmPassword: '',
             firstName: session?.user.name?.slice(0, session?.user.name.lastIndexOf(' ')) as string,
             lastName: session?.user.name?.slice(session?.user.name.lastIndexOf(' ')+1) as string,
         }
    })

    async function onSubmit (datas: z.infer<typeof FormSchema>) {
      //upload files 
     console.log("Data submitted", datas);

     mutateAsync(datas, {
        onSuccess: async () => {
           toast.success("Successfully Updated Profile");
           setStatus("Successfully Updated Profile");

           await update({
            ...session,
            user: {
               ...session?.user,
               name: data?.data.name
            }
         })
         setTimeout(() => {
           setStatus('');
           toast.dismiss();
         }, 2000);
        },
        onError: () => { 
           toast.error("Something went wrong");
           setStatus("Something went wrong");

         setTimeout(() => {
             setStatus('');
             toast.dismiss();
         }, 2000);
        }
     })}


     const handleDeleteAccount = async () => {
      try {
        await deleteAccount();
        toast.success("Account deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete account.");
      }
    };

  return (
    <>
      <div
        onClick={() => router.back()}
        className="mx-6 cursor-pointer mt-12 md:mx-24 w-auto flex items-center gap-2 "
      >
        <ChevronLeft size={24} />
        <span className="text-md">Go back</span>
      </div>

      <div className="flex place-items-center w-full justify-center h-screen lg:px-24 px-12">
        <div className="w-auto max-w-[780px] h-auto px-6 py-4 border">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-x-3 flex flex-col md:flex-row gap-4 lg:gap-16 items-start"
            >
              <div className="flex w-[250px] flex-col items-center gap-3">
                <Image
                  src={imageUrl}
                  alt="Profile avatar"
                  width={500}
                  height={500}
                  blurDataURL={imageUrl}
                  placeholder="blur"
                  className="size-24 lg:size-28 rounded-full object-cover border-violet-600 border-2"
                />
                {session?.user.provider === "credentials" && (
                  <UploadButton
                    endpoint="AvatarUploader"
                    content={{
                      button({ ready }) {
                        if (ready) return <div>Change Avatar</div>;

                        return "Getting ready...";
                      },
                      allowedContent({ ready, fileTypes, isUploading }) {
                        if (!ready) return "Please wait";
                        if (isUploading) return "uploading....";
                        return `Change Avatar ${fileTypes.join(", ")}`;
                      },
                    }}
                    onClientUploadComplete={async (res) => {
                      toast.success("Successfully updated Profile");
                      const avatar = await updateProfileAvatar(
                        res[0].url,
                        res[0].key
                      );

                      console.log("data picture", avatar);
                      toast.success("Successfully updated Avatar");

                      setTimeout(() => {
                        toast.dismiss();
                      }, 2000);

                      await update({
                        ...session,
                        user: {
                          ...session?.user,
                          image: avatar,
                        },
                      });
                      router.refresh();
                    }}
                  />
                )}
                {data?.data.message ? (
                  <p className="text-green-500">{status}</p>
                ) : (
                  <p className="text-red-500">{status}</p>
                )}
              </div>

              <div className="flex flex-col gap-4 w-[200px] sm:w-[250px] lg:w-[350px]">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  disabled={session?.user.provider !== "credentials"}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  disabled={session?.user.provider !== "credentials"}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  disabled={session?.user.provider !== "credentials"}
                />

                {isOpen ? (
                  <div className="relative flex flex-col gap-4 w-[200px] sm:w-[250px] lg:w-[350px]">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                      disabled={session?.user.provider !== "credentials"}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Confirm Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                      disabled={session?.user.provider !== "credentials"}
                    />
                    <X
                      className="absolute top-0 right-0 cursor-pointer"
                      size={18}
                      onClick={() => setIsOpen(false)}
                    />
                  </div>
                ) : (
                  <Button
                    className="text-gray-600"
                    type="button"
                    variant={"outline"}
                    onClick={() => setIsOpen(true)}
                    disabled={
                      session?.user.provider !== "credentials" || isPending
                    }
                  >
                    Change Password
                  </Button>
                )}
                <Button
                  className="bg-green-400 hover:bg-green-600"
                  type="submit"
                  disabled={
                    session?.user.provider !== "credentials" || isPending
                  }
                >
                  Submit
                </Button>

                <div className="w-full ">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex items-center w-full">
                        <Button
                          className="bg-red-600 mt-2 w-full hover:bg-red-500"
                          type="button"
                          disabled={
                            session?.user.provider !== "credentials" ||
                            isPending
                          }
                        >
                          Delete account
                        </Button>
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure you want to delete your
                          account??
                        </AlertDialogTitle>
                        <AlertDescription>
                          This cannot be undone
                        </AlertDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-800"
                        >
                          DELETE MY ACCOUNT
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </form>
          </Form>
          <p></p>
        </div>
      </div>
    </>
  );
}
