'use client'


import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


export default function Inputclient() {
     const [strVal, setStrVal] = useState<string>('');
     const [username, setUsername] = useState<string>('');
     const router = useRouter();
     const [error, setError] = useState<string>('');
     const formatStr = (s: string): void => setStrVal(s.replace(/\s/g, ""));

     async function handleSubmit(e: React.FormEvent) {
         e.preventDefault();
        
       try {
        console.log("Submitting with username:", username, "and secretCode:", strVal);
        const data = await axios.post('/api/forgotPassword', {
          username: username,
          secretCode: strVal,
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
         console.log(data);
         
         if(data.status === 200) {
             toast.success('Successful! Please wait...');
             router.push(`/change-password`);
         }
         else {
             setError(data.data.message);
         }
       } catch (error) {
           setError("Username and Secret code doesn't match!");
       }         
    }
     return (
       <>
         <Card className="px-4 py-2 text-center ">
           <CardHeader>
             <CardTitle>Retrieving your account</CardTitle>
             <CardDescription className="">
               <span>Please submit the correct details</span>
             </CardDescription>
           </CardHeader>
           <CardContent>
             <form
               onSubmit={handleSubmit}
               className="flex flex-col w-full gap-3 items-center"
             >
               <div className="flex flex-col w-full gap-2">
                 <Input
                   name="username"
                   placeholder="Username"
                   required
                   onChange={(e) => setUsername(e.target.value)}
                   value={username}
                 />
                 <Input
                   name="secretCode"
                   placeholder="Enter your Secret code"
                   onChange={(e) => formatStr(e.target.value)}
                   value={strVal}
                   required
                 />
               </div>
               <Button type="submit" className="w-full">
                 <p>Submit</p>
               </Button>
             </form>
            {error && <p role='alert' className='text-red-500 mt-4 text-sm'>{error.toString()}</p>}
           </CardContent>
         </Card>
       </>
     );
}
