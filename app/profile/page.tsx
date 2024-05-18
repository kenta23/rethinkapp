import React from 'react'
import { Metadata } from 'next';
import { auth } from '@/auth';
import ProfileSetting from "./ProfileSetting";
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import NavbarMain from '@/components/navbar-main';



export default async function Profile() {
    const session = await auth();

    if(!session?.user) return redirect('/login');

  return (
    <div className="w-full min-h-screen h-full">
       <NavbarMain />
       
       <ProfileSetting session={session}/>
    </div>
  );
}
