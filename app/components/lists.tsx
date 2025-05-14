'use client'

import { X } from 'lucide-react'
import React  from 'react'
import { savedDataDbType } from '../../types'
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/actions/projects';
import { truncateString } from '@/lib/utils';



export default function Lists({ data }: { data: savedDataDbType }) {
   const queryClient = useQueryClient();
   const router = useRouter();

   console.log('data',data);

   const { mutate, error, isPending, data: message } = useMutation({
       mutationFn: async (i: string) => await deleteProject(i),
       onError: (error: any) => console.log(error)
   })

   function formatDate(date: string) {
     const newDate = new Date(date);

       const formatDateTime = new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour12: true
       }).format(newDate);

       return formatDateTime;
   }
   
   function deleteFile (id: string, e: React.MouseEvent) {
     e.stopPropagation();
     e.preventDefault();

      if (isPending) {
         toast.loading('Deleting file.....');
      }
       mutate(id, {
         onSuccess: async () => {
           console.log('Done deleted!');
           toast.success(`${data?.name} Deleted successfully!`);
           await queryClient.invalidateQueries({ queryKey: ['projects'] });
           router.refresh();
         }
       })
   } 

  return (
    <Link
      href={`/main/${data?.id }`}
      className="border flex items-center gap-4
      border-[#8A7BE8] px-4 py-2 
      w-full
      max-w-[320px] h-[60px] min-h-[40px] rounded-xl 
      hover:bg-white/10 hover:scale-105 duration-200 ease-linear transition-all
      shadow-md shadow-gray-200 dark:shadow-gray-800 justify-between"
    >
      {/**DOCUMENT INFO */}
      <div>
        <p className="font-medium text-black dark:text-white">{truncateString(data?.name ?? '', 15)}</p>
        <p className="font-light text-[14px] text-gray-500">
          {formatDate(data?.updated_at?.toString() ?? '')} 
        </p>
      </div>

      <button className='cursor-pointer hover:scale-110' onClick={(e) => deleteFile(data?.id ?? '', e)}>
        <X className='text-red-400 dark:text-red-500' size={20} cursor={"pointer"} />
      </button>

    </Link>
  );
}

export function DeleteDialog() {
  return (
      <Card className='absolute top-0 '>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
  )
}
