'use client';
import { useNetwork } from '@/context/NetworkContext';
import { useUtils } from '@telegram-apps/sdk-react';
import { ChevronLeft, Compass, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export const BrowserView = () => {
  const apps = [
    {
      name: 'SOON Bridge',
      url: 'https://t.me/InterSOON_bot',
      imageUrl: '/assets/red.svg',
      about: 'Efficiently transfer assets between SOON and TON.',
    },
  ];
  const { network } = useNetwork();
  const utils = useUtils();
  const router = useRouter();
  return (
    <div className=" w-[100%] h-[100%]">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => router.back()} className="flex items-center">
          <ChevronLeft className="w-6 h-6 mr-4" />
          <h1 className="text-xl font-medium">Apps</h1>
        </button>
      </div>
      <div className=" bg-slate-50/0  w-[100%] flex py-2 px-2 ">
        <div className="border flex items-center px-2 mt-0.5 justify-center ml-auto mr-auto h-12 w-[95%] border-white/45 rounded-lg">
          <Search className="w-[8%] mr-4" />
          <input
            placeholder="Search for a sites"
            className="w-[82%] outline-none bg-transparent h-9"
          />
        </div>
      </div>
      {network.name === 'SOON' ? (
        <>
          <div className="flex items-center justify-between px-6 h-20">
            <div className="h-12 w-20 animate-pulse rounded-lg bg-white/10 "></div>
            <div className="h-12 w-20 animate-pulse rounded-lg bg-white/10 "></div>
            <div className="h-12 w-20 animate-pulse rounded-lg bg-white/10 "></div>
            <div className="h-12 w-20 animate-pulse rounded-lg bg-white/10 "></div>
          </div>
          <div className="w-[100%] flex flex-col items-center justify-center h-auto">
            {apps &&
              apps.map((app, i) => (
                <div
                  key={i}
                  className="bg-white/5 h-[160px] py-2 px-3 flex flex-col rounded-xl  w-[92%]"
                >
                  <div className="h-[60%] flex">
                    <div className="h-20 bg-black/20 rounded-xl w-20">
                      <Image
                        className="h-[98%] w-[98%]"
                        src={app.imageUrl}
                        alt={app.name}
                        height={100}
                        width={100}
                      />
                    </div>
                    <div className="mt-8 text-sm ml-2">{app.name}</div>
                    <div className="ml-auto mr-0 py-5 px-3">
                      <button
                        onClick={() => utils.openLink(app.url)}
                        className="w-[110px] rounded-lg h-10 text-black/75 text-sm bg-white/85"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                  <div className="h-[40%] px-1 flex items-center">
                    <div className="text-center">{app.about}</div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="mt-[90px] flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-center h-[300px]">
            <Compass className="w-[200px] h-[200px]" />
          </div>
          <p className="text-xl mb-2 font-light">Coming Soon</p>
          <p className="text-xl mb-20 font-light">{`on ${network.name}`}</p>
          <button
            onClick={() => router.back()}
            className="w-[60%] ml-auto mr-auto py-1 border border-[#448cff]/0 rounded-xl bg-white/90 h-12 flex justify-center items-center text-center text-black"
          >
            Back Home
          </button>
        </div>
      )}
    </div>
  );
};
