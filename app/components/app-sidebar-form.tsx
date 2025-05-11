'use client';

import React, { useState } from 'react'
import { DropdownMenuItem } from './ui/dropdown-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from './ui/alert-dialog';
import { Input } from './ui/input';
import { deleteProject, editProject } from '@/actions/projects';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';
import { z } from 'zod';
import { Form } from './ui/form';

export default function AppSidebarForm ({ id }: { id: string }) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const validateName = z.string().min(1, { message: "Name is required" });

    async function handleDelete () {  
        console.log("Deleted");

       await deleteProject(id).then(() => { 
            toast.success('Project deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['chat-history'] });
        }).catch((err) => toast.error(err.message || 'Failed to delete project'));
    }
       

    const { mutate, data, isError, isSuccess} = useMutation({ 
         mutationFn: async (name: string) => {
            const parsedName = validateName.safeParse(name);
            if(!parsedName.success) { 
                setError(parsedName.error.message);
                throw new Error(parsedName.error.message);
            }
            setError(null);
            return editProject(parsedName.data, id);
         },
         onError: (error) => { 
            toast.error(error.message || 'Failed to update project');
         }
    });



    function handleSubmit () {
        console.log("Submitted", name);
        mutate(name, { 
             onError: (error) => { 
                toast.error(error.message || 'Failed to update project');
             },
             onSuccess: () => { 
                toast.success('Project updated successfully');
                queryClient.invalidateQueries({ queryKey: ['chat-history'] });
                setName("");
                setOpen(false);
                router.refresh();
             },
        });
    };



    return (
        <DropdownMenu>  
            <DropdownMenuTrigger
                className="z-[100] cursor-pointer"
                asChild
            >
                <MoreHorizontal />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                sideOffset={10}
                align="center"
                side="bottom"
                className="bg-black/60 relative rounded-lg px-4 py-2"
            >
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="cursor-pointer"
                        >
                            <span>Edit Project</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#252031] text-white border border-gray-700">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Edit Project Name
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                Make changes to your project name here.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div onSubmit={handleSubmit}>
                            <Input
                                className="bg-transparent text-white border border-gray-400"
                                placeholder="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError(null);
                                }}
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-1">{error}</p>
                            )}

                            <AlertDialogFooter className='mt-6'>
                                <AlertDialogCancel 
                                className="bg-gray-700 text-white hover:bg-gray-600">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction type='button' onClick={handleSubmit} className="bg-[#8E61EC] cursor-pointer text-white hover:bg-[#7d4fd9]">
                                    Save Changes
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>



                  <AlertDialog>
                       <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            className="cursor-pointer"
                          >
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                       </AlertDialogTrigger>
                       <AlertDialogContent className="bg-[#252031] text-white border border-gray-700">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete Project
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to delete this project?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 cursor-pointer text-white hover:bg-gray-600">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDelete} 
                                className="bg-red-600 cursor-pointer text-white hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                       </AlertDialogContent>
                  </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
