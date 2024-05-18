
import { SignIn } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import NavbarMain from "@/components/navbar-main";
import { Metadata } from "next";
import { signIn, signOut } from "@/auth";
import CredentialForm from "./credentialForm";
import Link from "next/link";
import { auth } from "@/auth";
import OAuth from "./oAuth";

export const metadata: Metadata ={ 
  title: 'Sign in',
}

const LoginPage = async () => {
  const session = await auth(); 
  return (
    <>
      <NavbarMain />
      <main className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col min-w-full md:flex-row w-full min-h-screen justify-center items-center mx-auto">
          <Image
            src={"/Sign in.svg"}
            width={500}
            height={500}
            alt="Sign in svg"
            className="hidden size-[450px] md:block"
          />


          <div className="h-auto max-h-[550px] flex-1 min-w-[320px] md:w-[370px] md:flex-none px-4 py-6 border rounded-lg shadow-md">
            <h1 className="text-[25px] leading-relaxed font-medium text-gray-800 ">
               Welcome to <span className="text-primaryColor font-bold">ReThink</span>     
            </h1>
            <p className="font-normal text-md text-gray-500">Please sign in your account to get started</p>
            <CredentialForm />

            <OAuth />

            <p className="text-center text-gray-500 text-[14px] mx-auto mt-[20px]">
              Don&apos;t have an account?
              <Link
                href={"/register"}
                className="text-primaryColor hover:underline"
              >
                <span> Sign up</span>
              </Link>
            </p>

            {session?.user && <p>{session.user.email}</p>}
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;