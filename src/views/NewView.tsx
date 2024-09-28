"use client";
import { useInitData } from "@telegram-apps/sdk-react";
import { createSolanaWallet } from "@/lib/solana.lib";
import { UserService } from "@/lib/services/user.service";
import React, { useState, ChangeEvent } from 'react';
import {  ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Define 
interface FormData {
  email: string;
  pin: string;
}

interface FormErrors {
  email?: string;
  pin?: string;
}
export const NewView = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    pin: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter()
  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === 'pin') {
      setFormData(prev => ({ ...prev, [name]: value.slice(0, 4) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid Gmail address';
    }

    if (!formData.pin) {
      newErrors.pin = 'PIN is required';
    } else if (formData.pin.length !== 4) {
      newErrors.pin = 'PIN must be exactly 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      if (formData.email === '') {
        setIsNew(true);
      } else {
        console.log('Form submitted:', formData);
        // Proceed with user creation
        setIsNew(true);
      }
    }
  };

  const [isNew, setIsNew] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [created, setIsCreated] = useState<boolean>(true);
  const tgData = useInitData();
 
  
 
  const handleSubmit2 = async () => {
    if (tgData?.user?.id === undefined) {
      console.log("User ID is undefined");
      return;
    }
    setIsLoading(true)
    const walletInfo = await createSolanaWallet();
    const upload = UserService.CreateUser({
      user_id: tgData.user.id,
      email: formData.email,
      username: tgData.user.firstName,
      pin: formData.pin,
      privateKey: walletInfo?.secret,
      publicKey: walletInfo?.publicKey,
      mnemonic: walletInfo?.mnemonic,
    });
    console.log(upload, "created");
    if((await upload).success) {
      setIsCreated(true)
      setIsLoading(false)
    }
  };
  
  return (
    <div className="w-[100%]">
    
        {
          isNew ? 
          <div className="max-h-screen w-[100%] py-10">
        <div className=" flex items-center justify-center mb-[160px] w-[100%]  ">
         {
          isLoading && 
          <div className="w-[120px] rounded-3xl h-8 flex items-center justify-center bg-white/5 bg-opacity-90">
            {created ? <p className="font-light">Created</p> : <p className="font-light">Creating...</p>}
          </div>
         }
        </div>
       
        <div className="w-[100%] flex items-center justify-center h-[210px]">
          <div className="flex bg-black15 rounded-lg bg-opacity-30">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/show.png"
              className="h-[290px] outline-none w-[290px]"
            />
          </div>
        </div>
          <div className="mt-24 w-[90%] ml-auto mr-auto flex items-center justify-center">
            {
              created ? 
            <div onClick={() => router.refresh()} className="w-[99%] ml-auto mr-auto flex items-center justify-center h-12 rounded-2xl bg-white/80">
              <p className="ml-auto mr-auto text-black"> Continue</p>
            </div>
              :
            <div onClick={() => handleSubmit2()} className="w-[99%] ml-auto mr-auto flex items-center justify-center h-12 rounded-2xl bg-blue-800/80">
              <p className="ml-auto mr-auto"> Create New</p>
            </div>
            }
          
           </div>
          </div>
           : 
           <div className="w-[100%] max-h-screen py-2">
             <div className=" bg-slate-50/0 mb-[50px] w-[100%] flex flex-col ">
             <div onClick={() => router.back()} className="bg-white/5 flex items-center justify-center w-14 rounded-xl ml-2 h-8">
             <ArrowLeft  className="font-bold text-xl"/>
             </div>
            </div>
          <div className="max-w-md mx-auto w-[93%] mt-[250px] py-3 px-4 bg-white/5 bg-opacity-20 rounded-lg shadow-md">
           <form  className="space-y-6">
             <div>
               <label htmlFor="email" className="block text-sm ml-3 font-medium text-white/75">
                 Email
               </label>
               <input
                 type="email"
                 id="email"
                 name="email"
                 value={formData.email}
                 onChange={handleInputChange}
                 placeholder="Enter your Email address"
                 className="mt-1 block w-full px-3 py-2 bg-inherit  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
               />
               {errors.email && (
                 <p className="mt-2 text-sm text-red-600">{errors.email}</p>
               )}
             </div>
             <div>
               <label htmlFor="pin" className="block ml-3 text-sm font-medium text-white/75">
                 PIN
               </label>
               <input
                 type="tel"
                 id="pin"
                 name="pin"
                 value={formData.pin}
                 onChange={handleInputChange}
                 placeholder="Create 4-digit PIN"
                 pattern="[0-9]*"
                 inputMode="numeric"
                 maxLength={4}
                 className="mt-1 block w-full px-3 py-2 bg-inherit rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
               />
               {errors.pin && (
                 <p className="mt-2 text-sm text-red-600">{errors.pin}</p>
               )}
             </div>
             {<button
               onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
               type="submit"
               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
             >
              Continue
             </button>}
           </form>
         </div>
           </div>
           
        }
      </div>
 
  );
};
