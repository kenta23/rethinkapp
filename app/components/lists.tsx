'use client'

import { X } from 'lucide-react'
import React  from 'react'
import { savedDataDbType } from '../../types'
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { QueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/actions/projects';



export default function Lists({ data }: { data: savedDataDbType}) {
   const queryClient = new QueryClient();
   const router = useRouter();

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

      if(isPending) {
         toast.loading('Deleting file.....');
      }
       mutate(id, {
         onSuccess: async () => {
           console.log('Done deleted!');
           toast.success(`${data.name} Deleted successfully!`);
           await queryClient.refetchQueries({ queryKey: ['projects'] });
           router.refresh();
         }
       })
      //revalidatePath('/projects', 'page');
   } 

  return (
    <Link
      href={`/main/${data.id}`}
      className="border flex items-center gap-4
      border-primaryColor px-4 py-2 
      max-w-auto h-[65px] min-h-[40px] rounded-lg 
      hover:bg-purple-50 duration-200 ease-linear transition-colors
      shadow-md shadow-gray-200 justify-between "
    >
      {/**DOCUMENT INFO */}
      <div>
        <p className="font-medium">{data.name}</p>
        <p className="font-light text-[14px] text-gray-500">
          {formatDate(data.xata.updatedAt)}
        </p>
      </div>

      <button className='cursor-pointer hover:scale-110' onClick={(e) =>  deleteFile(data.id!, e)}>
        <X size={24} cursor={"pointer"} />
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
