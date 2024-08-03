 'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
 import React, { useState } from 'react'
 import { useForm } from 'react-hook-form'
 import { useDebounceCallback } from 'usehooks-ts';
 import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
 
  function page(){
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
  } = useForm()

 const onSubmit = async (data)=>{
  setIsSubmitting(true)
  const result = await signIn('credentials', {
    redirect: false,
    identifier: data.identifier,
    password: data.password,
  });
  setIsSubmitting(false)
  if (result?.error) {
    if (result.error === 'CredentialsSignin') {
      toast({
        title: 'Login Failed',
        description: 'Incorrect username or password',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  }
  toast({
    title: 'Successful Login',
    description: "User has Successful Login in there Account",
    
  });
  if (result?.url) {
   
    router.replace('/dashboard');
  }
};
   return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          MSRTC
        </h1>
        <p className="mb-4">Sign In to start our services</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
       <Label htmlFor="username">Phone Number <span className='text-red-500'>or</span> Username</Label>
        <Input type="text" {...register("identifier")} />
    
       <Label htmlFor="password">Password</Label>
       <Input type="text"  {...register("password")}/>
       <div className='flex items-center justify-between'>
       <p>
            Are you new User?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
          </p>
          <Button type="submit">
            {  isSubmitting?(<Loader2 className="animate-spin">submiting</Loader2>):('Sign Up')}
          </Button>
       </div>
       </form>
    </div>
  </div>
   )
 }
 
 export default page
 