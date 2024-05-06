import React from 'react'
import Lists, { DeleteDialog } from './lists';
import { useQuery } from '@tanstack/react-query';
import { Loader, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Archive() {
  const { isPending, error, data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then((res) => res.data),
    staleTime: 1000 * 60,
  })

  return (
    <div className="p-4 gap-6 w-full max-h-[600px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {isPending ? (
        <Loader2 className="size-8 text-violet-600 text-center animate-spin" />
      ) : error ? (
        <p className="text-gray-600">Something went wrong.</p>
      ) : !data ?  (
        <p className="text-gray-600">No projects yet.</p>
      ) : (
        data.map((item: any) => <Lists data={item} key={item.id} />)
      )}
    </div>
  ); 
} 
