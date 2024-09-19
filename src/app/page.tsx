'use client'
//import { useState } from "react";
import { Homeview } from "@/views/HomeView";
import { useEffect } from "react";
//import { Loading } from "@/components/LoadingScreen";

//import Image from "next/image";
//import { useInitData } from "@telegram-apps/sdk-react";
export default function Home() {
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
      console.log('Function triggered after 20 seconds!');
    }, 20000);
  },[])
  //const data = useInitData();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Homeview />
    </div>
  );
}
