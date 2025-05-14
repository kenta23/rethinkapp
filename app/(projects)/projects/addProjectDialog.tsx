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
import { UploadThingError } from 'uploadthing/server';



type documentType = {
    url: string,
    file_key: string
}


export default function AddProjectDialog() {
    const router = useRouter(); 

  
    const { mutate,  data } = useMutation({
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
            "ut-ready:bg-yellow-500 w-45 rounded-lg ut-uploading:cursor-not-allowed ut-uploading:opacity-50 px-3 py-2 bg-violet-500 cursor-pointer text-sm after:bg-green-400",
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
                toast.success("Redirecting you to the next page please wait...");
                router.push(`/main/${result.data}`);
                console.log("result: ", result);
              },
              onError: (err) => {
                toast.error(err.message);
              },
            }
          );
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message);
        }}
      />
      {/**ARCHIVES LISTS */}
        <Archive />
    </div>
  );
}
