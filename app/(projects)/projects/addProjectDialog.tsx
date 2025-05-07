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
    userId: string | null | undefined,
    name: string,
    file: globalThis.File[],
    url: string,
    file_key: string
}


export default function AddProjectDialog({ session }: { session: Session | null }) {
    const [ uploading, setUploading] = useState<boolean>(false); 
    const router = useRouter(); 
    const [data, setData] = useState<documentType>({
      userId: session?.user.id as string,
      name: '',
      file: [],
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
    <div className="flex items-start gap-2 flex-col">
    <Dialog>
      <DialogTrigger asChild>
        {/**CREATE BUTTON HERE */}
        <div className="flex flex-col gap-2">
          <button
            disabled={!session?.user}
            className={`${
              !session?.user
                ? "bg-gray-500"
                : "bg-[#4B3F94] hover:bg-violet-700"
            } text-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] duration-200 ease-in-out text-white rounded-md text-[18px]`}
            type="button"
          >
            <Plus size={32} className="m-auto" />
          </button>
          <span className="text-[#55545E] dark:text-gray-400 font-medium ">
            Create new
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form>
          <DialogHeader>
            <DialogTitle>Create new document</DialogTitle>
            <DialogDescription>
              Make changes to your new work here. Click save when
              youre done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name of your work
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={handleDataValue}
                name="name"
                className="col-span-3"
                disabled={uploading || isSuccess}
              />
            </div>
            {data.name.length < 6 && (
              <p className="w-full text-center font-medium text-[12px] text-red-500">
                The length of document name must be 6 characters long
                with no special characters or numbers
              </p>
            )}

            {/** DROP ZONE FILES**/}
            <div className="p-2 bg-white rounded-xl">
              <div>
                {data.name.length >= 6 && (
                  <UploadDropzone
                    endpoint="pdfUploader"
                    content={{
                      allowedContent: "Maximum file size is 32mb",
                    }}
                    onUploadProgress={() => {
                      setUploading(true);
                    }}
                    onClientUploadComplete={(res) => {
                      // Do something with the response
                      //console.log("File key: ", res[0].key);
                      setUploading(false);
                      mutate(
                        {
                          ...data,
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
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <p className="text-center w-full text-gray-400 font-medium text-[12px]">
              Upload document (pdf) to proceed
            </p>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/**ARCHIVES LISTS */}
    {session?.user ? (
      <div className="overflow-y-clip w-full max-w-full">
        {/**archive items */}
        <div className="max-h-[550px] overflow-y-auto w-full min-w-full"> 
          {/**START MAPPING ITEMS HERE */}
          <Archive />
        </div>
      </div>
    ) : (
      <p className="self-center mx-auto mt-[70px] text-[18px] font-normal text-[#A09EA8]">
        Log in to continue
      </p>
    )}
  </div>
  )
}
