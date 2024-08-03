'use client';

 
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import { z } from 'zod';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();
  const { toast } = useToast();
 

  const {
    register,
    handleSubmit,
  } = useForm()



  useEffect(() => {
  
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset message
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
         
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data) => {
    console.log(data)
    setIsSubmitting(true);
    try {
      //sign up
      const response = await axios.post('/api/sign-up', data);
     //sign in
      const login = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if(login){
        toast({
          title: 'Success',
          description: response.data.message,
        });
      }
      router.replace(`/verify/${data.username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error;
      let errorMessage = axiosError.response?.data.message ?? 'There was a problem with your sign-up. Please try again.';

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            MSRTC
          </h1>
          <p className="mb-4">Sign up to start our services</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
         <Label htmlFor="username">Username</Label>
         <Input type="text" {...register("username")} onChange={(e)=> debounced(e.target.value)}/>
         <div>
         {isCheckingUsername && <Loader2 className='animate-spin'></Loader2>}
         {!isCheckingUsername && usernameMessage && (
          <p
           className={`text-sm ${usernameMessage==='Username is unique'? 'text-green-500': "text-red-500"}`} 
          >{usernameMessage}</p>
         )}
         </div>
         <Label htmlFor="phoneNo">Phone Number</Label>
         <Input type="number" {...register("phoneNo")}/>
         <Label htmlFor="password">Password</Label>
         <Input type="text"  {...register("password")}/>
         <div className='flex items-center justify-between'>
         <p>
              Already a member?{' '}
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
            <Button type="submit">
              {isSubmitting?(<Loader2 className="animate-spin">submiting</Loader2>):('Sign Up')}
            </Button>
         </div>
         </form>
      </div>
    </div>
  );
}
