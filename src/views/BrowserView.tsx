"use client";
import { ArrowLeft, Compass, Search } from "lucide-react";
import { useUtils } from "@telegram-apps/sdk-react";
import { useRouter } from "next/navigation";
import { useNetwork } from "@/context/NetworkContext";
export const BrowserView = () => {
  const apps = [
    {
      name: "SOON Bridge",
      url: "https://t.me/InterSOON_bot",
      imageUrl:
        "https://docs.soo.network/~gitbook/image?url=https%3A%2F%2F2478866811-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252Fa24JzwJLe3ovDddlY1Jn%252Fsites%252Fsite_ivI66%252Ficon%252Fg3v3CNr0aS623TxxZmF0%252Fhalf-red-on-black-glow_360.png%3Falt%3Dmedia%26token%3D6b79a2a9-c846-4a63-b09c-b51e653b1974&width=32&dpr=1&quality=100&sign=29a11b88&sv=1",
      about: "Efficiently transfer assets between SOON and TON.",
    },
  ];
  const { network } = useNetwork();
  const utils = useUtils();
  const router = useRouter();
  return (
    <div className=" w-[100%] h-[100%]">
      <div className=" bg-slate-50/0 mb-[10px] w-[100%] flex py-3 px-2 ">
        <div
          onClick={() => router.back()}
          className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
        >
          <ArrowLeft className="font-bold text-xl" />
        </div>
        <div className="ml-auto mt-1 mr-[43%]">
          <p className="font-light text-xl">Apps</p>
        </div>
      </div>
      <div className=" bg-slate-50/0  w-[100%] flex py-3 px-2 ">
        <div className="border flex items-center px-2 mt-0.5 justify-center ml-auto mr-auto h-12 w-[95%] border-white/45 rounded-lg">
          <Search className="w-[8%] mr-4" />
          <input
            placeholder="Search for a sites"
            className="w-[82%] outline-none bg-transparent h-9"
          />
        </div>
      </div>
      {network.name === "SOON" ? (
        <>
          <div className="flex items-center justify-between px-6 h-20">
            <div className="h-12 w-20 animate-pulse rounded-lg bg-white/5 "></div>
            <div className="h-12 w-20 animate-pulse rounded-lg bg-white/5 "></div>
            <div className="h-12 w-20 animate-pulse rounded-lg bg-white/5 "></div>
            <div className="h-12 w-20 animate-pulse rounded-lg bg-white/5 "></div>
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
                      <img
                        className="h-[98%] w-[98%]"
                        src={app.imageUrl}
                        alt={app.name}
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
          <div
            onClick={() => router.back()}
            className="w-[60%] ml-auto mr-auto py-1 border border-[#448cff]/0 rounded-xl bg-white/90 h-12 flex justify-center items-center"
          >
            <p className="text-center text-black">Back Home</p>
          </div>
        </div>
      )}
    </div>
  );
};
