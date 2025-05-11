'use client';

import { DialogDescription, DialogTitle, DialogContent, DialogHeader, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import Archive from '@/components/archive';
import { UploadDropzone } from '@/lib/uploadthing';
import { Session } from 'next-auth';



type documentType = {
    url: string,
    file_key: string
}


export default function AddProjectDialog({ session }: { session: Session | null }) {
    const [ uploading, setUploading] = useState<boolean>(false); 
    const router = useRouter(); 
    const [data, setData] = useState<documentType>({
      url: '',
      file_key: ''
   })

    const { mutate, isPending, isSuccess } = useMutation({
      mutationFn: async (items: documentType) => axios.post('/api/store-data', items),
      onError: (err) => {
        console.log(err.message);
      },
      onSuccess: () => {
       console.log('Successful Please wait...');
      }
   })

   console.log("uploading", uploading );

    
   function handleDataValue(e: ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target
      const formattedValue = value.replace(/[^a-zA-Z_\-]/g, '');  //empty string on numbers and other characters that are not hypens and underscores
      setData(prev => ({
        ...prev,
        [name]: formattedValue,
        userId: session?.user.id as string,
      }))
   }

   
  return (
    <div className="mt-8 flex items-center justify-center gap-6 flex-col">
      {/**CREATE BUTTON HERE */}
      <UploadDropzone
        endpoint="pdfUploader"
        content={{
          allowedContent: "Maximum file size is 32mb",
        }}
        className="py-4"
        appearance={{
          button:
            "ut-ready:bg-yellow-500 rounded-lg ut-uploading:cursor-not-allowed px-3 py-2 bg-violet-500 text-sm after:bg-green-400",
          uploadIcon: "text-gray-400",
          container: "border-dashed border-[#998CEE]",
          label: "text-lg dark:text-white",
        }}
        onUploadProgress={() => {
          setUploading(true);
        }}
        onClientUploadComplete={(res) => {
          // Do something with the response
          setUploading(false);
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
      {session?.user ? (
        <Archive />
      ) : (
        <p className="self-center mx-auto mt-[70px] text-[18px] font-normal text-[#A09EA8]">
          Log in to continue
        </p>
      )}
    </div>
  );
}
