import { SignUp } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import NavbarMain from "@/components/navbar-main";
import { Metadata } from "next";
import Signup from "./signup";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FormPage from "./Form";

export const metadata: Metadata ={ 
    title: 'Sign up',
}

const RegisterPage = async () => {
  const session = await auth();
  return (
    <>
      <NavbarMain />
      <main className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col md:flex-row w-full min-h-screen justify-evenly items-center mx-[100px] ">
          <Image
            src={"/Sign up.svg"}
            width={400}
            height={300}
            alt="Sign up svg"
            className=""
          />

          <div className="min-h-[560px] flex-1 min-w-[320px] md:w-[370px] md:flex-none px-4 py-6 border rounded-lg shadow-sm">
            <h1 className="font-medium text-[27px]">
              Create your Account
            </h1>
            <p className="font-normal text-md text-gray-500">Sign up your account</p>

            <Signup />

            <p className="text-center text-gray-500 text-[14px] mx-auto mt-[20px]">Already have an account? 
                     <Link href={'/login'} className="text-violet-700 hover:underline">
                         <span> Sign in</span>
                     </Link>
              </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default RegisterPage;



