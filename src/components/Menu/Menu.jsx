'use client';

import { Compass } from 'lucide-react';
import Link from 'next/link';
import { GrAppsRounded } from 'react-icons/gr';
import { IoWallet } from 'react-icons/io5';

export const Menu = () => {
  return (
    <div className=" w-[100%] ml-auto mr-auto rounded-xl py-0.5  px-1.5 z-100 bg-black/30  bg-opacity-80  fixed bottom-0.5 flex justify-center items-center">
      <div className="lg:py-2.5 py-2 lg:px-2.5 px-1.5  mt-  ml-auto mr-auto w-[98%] flex flex-row  h-[90%]">
        <div
          className={`h-12 ml-auto mr-auto bg-white/0 flex items-center justify-center`}
        >
          <Link
            href="/wallet"
            className="flex flex-col ml-auto mr-auto items-center justify-center"
          >
            <IoWallet size={28} className={`text-white/75`} />
            <span className={`font-light mt-1 text-white text-[10px]`}>
              Wallet
            </span>
          </Link>
        </div>
        <div
          className={`h-12 ml-auto mr-auto bg-white/0 flex  items-center justify-center`}
        >
          <Link
            href="/collectibles"
            className="flex ml-auto mr-auto flex-col items-center justify-center"
          >
            <GrAppsRounded size={28} className={`text-white/75`} />
            <span className={`font-light mt-1 text-white text-[10px]`}>
              Collectibles
            </span>
          </Link>
        </div>

        <div
          className={`h-12 ml-auto mr-auto bg-white/0 flex  items-center justify-center`}
        >
          <Link
            href="/dapps"
            className="flex ml-auto mr-auto flex-col items-center justify-center"
          >
            <Compass />
            <span className={`font-light mt-1 text-white text-[10px]`}>
              Apps
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
