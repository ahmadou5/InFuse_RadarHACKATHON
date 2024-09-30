"use client";
import { Wallet } from "lucide-react";
//import { useState } from "react";
import { useRouter } from "next/navigation";



export const Menu = () => {
  const router = useRouter()
  
  return (
    <>
      {/**for mobile view **/}

      {/**for desktop view **/}
      <div
        style={{ "backdrop-filter": "blur(12px)" }}
        className=" w-[100%] ml-auto mr-auto rounded-xl py-2 px-1.5 z-100 bg-black/45  fixed bottom-1 flex justify-center items-center"
      >
        <div className="lg:py-2.5 py-2 lg:px-2.5 px-1.5  mt- mb-auto ml-auto mr-auto w-[98%] flex flex-row  h-[90%]">
          <div
            className={`h-12 ml-auto mr-auto w-[25%] bg-white/0 flex items-center justify-center`}
          >
            <div
              onClick={() => router.push('/wallet')}
              className="flex flex-col ml-auto mr-auto items-center justify-center"
            >
              <Wallet />
              <p className={`font-light mt-1 text-white text-[10px]`}>Tasks</p>
            </div>
          </div>

        
          <div
            className={`h-12 ml-auto mr-auto w-[25%] bg-white/0 flex  items-center justify-center`}
          >
            <div
              
              className="flex ml-auto mr-auto flex-col items-center justify-center"
            >
              <img src="./assets/board.svg" className="w-7 h-7" />
              <p className={`font-light mt-1 text-white text-[10px]`}>
                Leaderboard
              </p>
            </div>
          </div>
          <div
            className={`h-12 ml-auto mr-auto w-[25%] bg-white/0 flex  items-center justify-center`}
          >
            <div
              
              className="flex ml-auto mr-auto flex-col items-center justify-center"
            >
              <img src="./assets/community.svg" className="w-7 h-7" />
              <p className={`font-light mt-1 text-white text-[10px]`}>Frens</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
