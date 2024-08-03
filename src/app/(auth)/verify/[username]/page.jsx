'use client';

import { Button } from '@/components/ui/button';
 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
 
 
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
 

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error 
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code that has sent on your Phone Number</p>
        </div>
        
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                  <Label>Verification Code</Label>
                  <Input {...register("code")} />
            <Button type="submit">Verify</Button>
          </form>
       
      </div>
    </div>
  );
}