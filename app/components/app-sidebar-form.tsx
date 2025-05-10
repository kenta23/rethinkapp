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
import { usePathname } from 'next/navigation';
import { z } from 'zod';

export default function AppSidebarForm ({ id }: { id: string }) {
    const queryClient = useQueryClient();
    const pathname = usePathname();
    const projectId = pathname.split('/').pop() || '';
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const validateName = z.string().min(1, { message: "Name is required" });

    function handleDelete () {  
        console.log("Deleted");
        deleteProject(projectId);
    }

    const { mutate, data, isError, isSuccess} = useMutation({ 
         mutationFn: async (name: string) => {
            const parsedName = validateName.safeParse(name);
            if(!parsedName.success) { 
                setError(parsedName.error.message);
                throw new Error(parsedName.error.message);
            }
            setError(null);
            return editProject(parsedName.data, projectId);
         },
         onSuccess: () => { 
            toast.success('Project updated successfully');
            queryClient.invalidateQueries({ queryKey: ['chat-history'] });
            setName("");
            setOpen(false);
         },
         onError: (error) => { 
            toast.error(error.message || 'Failed to update project');
         }
    });

    console.log(name);

    function handleSubmit () {
        console.log("Submitted", name);
        mutate(name);
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
                align="start"
                side="left"
                className="bg-gray-400 relative rounded-lg px-4 py-2"
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

                        <form onSubmit={handleSubmit}>
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
                                <AlertDialogAction type="button" onClick={handleSubmit} className="bg-[#8E61EC] cursor-pointer text-white hover:bg-[#7d4fd9]">
                                    Save Changes
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>

                <DropdownMenuItem onClick={handleDelete} className="cursor-pointer">
                    <span>Delete Project</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
