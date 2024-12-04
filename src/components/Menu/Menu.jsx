"use client";

import { IoWallet } from "react-icons/io5";
import { GrAppsRounded } from "react-icons/gr";
//import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";



export const Menu = () => {
  const router = useRouter()
  
  return (
    <>
      {/**for mobile view **/}

      {/**for desktop view **/}
      <div
        
        className=" w-[100%] ml-auto mr-auto rounded-xl py-0.5  px-1.5 z-100 bg-black/30  bg-opacity-80  fixed bottom-0.5 flex justify-center items-center"
      >
        <div className="lg:py-2.5 py-2 lg:px-2.5 px-1.5  mt-  ml-auto mr-auto w-[98%] flex flex-row  h-[90%]">
          <div
            className={`h-12 ml-auto mr-auto bg-white/0 flex items-center justify-center`}
          >
            <div
              onClick={() => router.push('/wallet')}
              className="flex flex-col ml-auto mr-auto items-center justify-center"
            >
              <IoWallet size={28} className={`text-white/75`} />
              <p className={`font-light mt-1 text-white text-[10px]`}>Wallet</p>
            </div>
          </div>
          <div
            className={`h-12 ml-auto mr-auto bg-white/0 flex  items-center justify-center`}
          >
            <div
              onClick={() => router.push('/collectibles')}
              className="flex ml-auto mr-auto flex-col items-center justify-center"
            >
              <GrAppsRounded  size={28} className={`text-white/75`} />
              <p className={`font-light mt-1 text-white text-[10px]`}>
                Collectibles
              </p>
            </div>
          </div>

        
          <div
            className={`h-12 ml-auto mr-auto bg-white/0 flex  items-center justify-center`}
          >
            <div
              onClick={() => router.push('/dapps')}
              className="flex ml-auto mr-auto flex-col items-center justify-center"
            >
              <Compass />
              <p className={`font-light mt-1 text-white text-[10px]`}>
                Apps
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};
