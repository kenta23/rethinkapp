import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
import { signIn } from '../../../auth';
import Form from 'next/form';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export default function OAuth() {

   async function handleSubmit(formdata: FormData) { 
      "use server"
     const provider = formdata.get('provider');
     await signIn(provider as string);
   }
     
  return (
    <div className='mt-[35px] space-y-4' >
      <Form action={handleSubmit}>
        <Button
          id='google'
          name='provider'
          value='google'
          className="w-full h-[45px] text-black bg-purple-50 hover:bg-gray-500 hover:text-white  border-gray-600 shadow-sm "
          type="submit"
          aria-placeholder="Log in"
        >
          <Image
            src={"/google-icon.png"} 
            width={22}
            height={22}
            alt="google icon"
          />
          <span className='ms-6 text-[15px] font-medium'>Continue with Google</span>
        </Button>  

        <Button
          id='github'
          name='provider'
          value='github'
          className="w-full h-[45px] text-black bg-purple-50 hover:text-white hover:bg-gray-500  border-gray-600 shadow-sm "
          type="submit"
          aria-placeholder="Log in"
        >
          <Image
            src={"/github_icon.png"} 
            width={25}
            height={25}
            alt="github icon"
          />
          <span className='ms-6 text-[15px] font-medium'>Continue with Github</span>
        </Button> 
      </Form>
    </div>
  );
}
