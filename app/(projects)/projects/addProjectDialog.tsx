'use client';

import React, { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import Archive from '@/components/archive';
import { UploadDropzone } from '@/lib/uploadthing';
import { Session } from 'next-auth';
import prisma from '@/lib/prisma';



type documentType = {
    url: string,
    file_key: string
}


export default function AddProjectDialog({ session }: { session: Session | null }) {
    const router = useRouter(); 
    const [data, setData] = useState<documentType>({
      url: '',
      file_key: ''
   })
   const [enableUpload, setEnableUpload] = useState<boolean>(true);

  
    const { mutate, isPending, isSuccess } = useMutation({
      mutationFn: async (items: documentType) => axios.post('/api/store-data', items),
      onError: (err) => {
        console.log(err.message);
      },
      onSuccess: () => {
       console.log('Successful Please wait...');
      }
   })

   
  return (
    <div className="mt-8 flex items-center justify-center gap-6 flex-col">
      {/**CREATE BUTTON HERE */}
      <UploadDropzone
        endpoint="pdfUploader"
        disabled={!enableUpload}
        config={{ 
          appendOnPaste: true,
          mode: "auto"
        }}
        content={{
          allowedContent: "Maximum file size is 32mb",
        }}
        className="py-4"
        appearance={{
          button:
            "ut-ready:bg-yellow-500 rounded-lg ut-uploading:cursor-not-allowed ut-uploading:opacity-50 px-3 py-2 bg-violet-500 cursor-pointer text-sm after:bg-green-400",
          uploadIcon: "text-gray-400",
          container: "border-dashed border-[#998CEE]",
          label: "text-lg dark:text-white",
        }}
        onUploadProgress={(progress) => {
            console.log("progress: ", progress);
            return `${progress}%`
        }}
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("RES: ", res);
          mutate(
            {
              url: res[0].ufsUrl,
              file_key: res[0].key,
            },
            {
              onSuccess: (result) => {
                //result from the Response api
                toast.success("Successful");
                router.push(`/main/${result.data}`);
                console.log("result: ", result);
              },
              onError: (err) => {
                toast.error("Error " + err.message);
              },
            }
          );
        }}
        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error.message}`);
        }}
      />
      {/**ARCHIVES LISTS */}
        <Archive />
      {/* {session?.user ? (
        <Archive />
      ) : (
        <p className="self-center mx-auto mt-[70px] text-[18px] font-normal text-[#A09EA8]">
          Log in to continue
        </p>
      )} */}
    </div>
  );
}
