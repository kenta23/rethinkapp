import React from 'react'
import Lists, { DeleteDialog } from './lists';
import { useQuery } from '@tanstack/react-query';
import { Loader, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';


const dummyData = Array.from({ length: 30 }, (_, index) => ({
  id: (index + 1).toString(),
  name: `Project ${index + 1}`,
  file_link: null,
  file_key: null,
  user_id: `user_${index + 1}`,
  created_at: new Date(),
  updated_at: new Date(),
}));



export default function Archive() {
  const { isPending, error, data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then((res) => res.data),
    staleTime: 2000 * 60, //2 minute staletime
  })


  return (
    <div className="p-4 gap-5 w-3/4 mx-auto max-h-[calc(100vh-400px)] overflow-y-auto scroll grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {isPending ? (
        <Loader2 className="size-8 text-violet-600 text-center animate-spin" />
      ) : error ? (
        <p className="text-gray-600">Something went wrong.</p>
      ) : data && data.length === 0 ? (
        <p className="text-gray-600">No projects yet.</p>
      ) : (
        data.map((item: any) => <Lists data={item} key={item.id} />)
      )}
    </div>
  ); 
} 


