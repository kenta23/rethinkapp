
import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { auth } from "../../../auth";
import OAuth from "./oAuth";
import { redirect } from "next/navigation";

export const metadata: Metadata ={ 
  title: 'Sign in',
}

export default async function LoginPage() {

  const session = await auth(); 

  if (session) redirect("/projects");


  return (
    <>      
      <main className="min-h-screen bg-white dark:bg-[#0e0c0f] w-full flex items-center justify-center">
        <div className="flex flex-col min-w-full md:flex-row w-full min-h-screen justify-center items-center mx-auto">
          <Image
            src={"/Sign in.svg"}
            width={500}
            height={500}
            alt="Sign in svg"
            className="hidden size-[450px] md:block"
          />

          <div className="h-auto max-h-[550px] flex-1 min-w-[320px] md:w-[370px] md:flex-none px-4 py-6 border rounded-lg shadow-md">
            <h1 className="text-2xl leading-relaxed font-medium text-black dark:text-white">
               Welcome to <span className="text-violet-700 dark:text-violet-500 font-bold">ReThink</span>     
            </h1>
            <p className="font-normal text-md text-gray-500 dark:text-gray-200">Please sign in your account to get started</p>
            <OAuth />
          </div>
        </div>
      </main>
    </>
  );
};

