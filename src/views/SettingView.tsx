"use client";
import { ArrowLeft, ChevronRight, Circle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { networkList } from "@/utils/networks.utils";
import { useNetwork } from "@/context/NetworkContext";
export const SettingView = () => {
  const [account, setAccount] = useState<boolean>(false);
  const [community, setCommunity] = useState<boolean>(false);
  const [networks, setNetworks] = useState<boolean>(false);
  const [options, setOptions] = useState<boolean>(false);
  const [connect, setConnect] = useState<boolean>(false);
  const [about, setAbout] = useState<boolean>(false);
  const [setting, setSetting] = useState<boolean>(true);
  const { setActiveChain, network } = useNetwork();
  const router = useRouter();
  return (
    <>
      {about && (
        <>
          <div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0 py-2 text-white/70 mb-2 flex-col items-center justify-center w-[100%] h-auto">
            <div className=" bg-slate-50/0 mb-[20px] w-[100%] px-2 flex  ">
              <div
                onClick={() => {
                  //setAccount(false);
                  setAbout(false);
                  setSetting(true);
                }}
                className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
              >
                <ArrowLeft className="font-bold text-xl" />
              </div>
              <div className="ml-auto mt-1.5 mr-[45%]">
                <p className="text-white text-[16px] font-bold">About</p>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => setAccount(true)}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Account</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Active Networks</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Connected Apps</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] mt-4 h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Developers Options</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Community</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">About</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="flex flex-col mt-20 items-center justify-center">
                <img src="/assets/show.png" className="h-12 w-12" />
                <p className="text-[21px] text-white/95 font-semibold">
                  InFuse Wallet
                </p>
                <p>version 1.8.8</p>
              </div>
            </div>
          </div>
        </>
      )}
      {connect && (
        <>
          <div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0 py-2 text-white/70 mb-2 flex-col items-center justify-center w-[100%] h-auto">
            <div className=" bg-slate-50/0 mb-[20px] w-[100%] px-2 flex  ">
              <div
                onClick={() => {
                  setConnect(false);
                  setSetting(true);
                }}
                className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
              >
                <ArrowLeft className="font-bold text-xl" />
              </div>
              <div className="ml-auto mt-1.5 mr-[45%]">
                <p className="text-white text-[16px] font-bold">connect</p>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => setAccount(true)}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Account</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Active Networks</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Connected Apps</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] mt-4 h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Developers Options</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Community</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">About</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="flex flex-col mt-20 items-center justify-center">
                <img src="/assets/show.png" className="h-12 w-12" />
                <p className="text-[21px] text-white/95 font-semibold">
                  InFuse Wallet
                </p>
                <p>version 1.8.8</p>
              </div>
            </div>
          </div>
        </>
      )}
      {networks && (
        <>
          <div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0 py-2 text-white/70 mb-2 flex-col items-center justify-center w-[100%] h-auto">
            <div className=" bg-slate-50/0 mb-[20px] w-[100%] px-2 flex  ">
              <div
                onClick={() => {
                  setNetworks(false);
                  setSetting(true);
                }}
                className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
              >
                <ArrowLeft className="font-bold text-xl" />
              </div>
              <div className="ml-auto mt-1.5 mr-[45%]">
                <p className="text-white text-[16px] font-bold">Chains</p>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
              {networkList &&
                networkList
                  .filter((network) => network.isTestNet === false)
                  .map((item, i) => (
                    <div
                      key={i}
                      className="w-[99%] h-[60px] mt-1 mb-1 rounded-xl bg-slate-500/15 ml-auto mr-auto"
                    >
                      <div className="w-[100%] py-2.5 px-5 flex">
                        <div className="flex">
                          <div className="bg-white/10 animate-pulse flex items-center justify-center  w-10 h-10 rounded-2xl">
                            <img src={item?.native?.logoUrl} />
                          </div>
                          <p className="text-[18px] mt-2 ml-2 mr-2 ">
                            {item.name}
                          </p>
                        </div>
                        <div
                          className="flex ml-auto mr-0.5 items-center bg-gray-200/10 rounded-full p-1 w-20 cursor-pointer"
                          onClick={() => setActiveChain(item)}
                        >
                          <div
                            className={`flex items-center justify-center w-full relative h-8 ${
                              network.name === item.name
                                ? ""
                                : "flex-row-reverse"
                            }`}
                          >
                            {/* Background slider */}
                            <div
                              className={`absolute w-1/2 h-full bg-white/30 rounded-full shadow-md transition-transform duration-200 ease-in-out
            ${network.name === item.name ? "left-0" : "left-1/2"}`}
                            />

                            {/* Icons */}
                            <div className="relative flex w-full">
                              <div
                                className={`flex-1 flex justify-center z-10 transition-colors duration-200 
            ${network.name === item.name ? "text-green-500" : "text-gray-400"}`}
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div
                                className={`flex-1 flex justify-center z-10 transition-colors duration-200 
            ${network.name === item.name ? "text-gray-500" : "text-gray-400"}`}
                              >
                                <Circle className="w-5 text-red-600/15 h-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </>
      )}
      {community && (
        <>
          <div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0 py-2 text-white/70 mb-2 flex-col items-center justify-center w-[100%] h-auto">
            <div className=" bg-slate-50/0 mb-[20px] w-[100%] px-2 flex  ">
              <div
                onClick={() => {
                  setCommunity(false);
                  setSetting(true);
                }}
                className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
              >
                <ArrowLeft className="font-bold text-xl" />
              </div>
              <div className="ml-auto mt-1.5 mr-[45%]">
                <p className="text-white text-[16px] font-bold">Community</p>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => setAccount(true)}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Account</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Active Networks</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Connected Apps</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] mt-4 h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Developers Options</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Community</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">About</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="flex flex-col mt-20 items-center justify-center">
                <img src="/assets/show.png" className="h-12 w-12" />
                <p className="text-[21px] text-white/95 font-semibold">
                  InFuse Wallet
                </p>
                <p>version 1.8.8</p>
              </div>
            </div>
          </div>
        </>
      )}
      {options && (
        <>
          <div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0 py-2 text-white/70 mb-2 flex-col items-center justify-center w-[100%] h-auto">
            <div className=" bg-slate-50/0 mb-[20px] w-[100%] px-2 flex  ">
              <div
                onClick={() => {
                  setOptions(false);
                  setSetting(true);
                }}
                className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
              >
                <ArrowLeft className="font-bold text-xl" />
              </div>
              <div className="ml-auto mt-1.5 mr-[45%]">
                <p className="text-white text-[16px] font-bold">Option</p>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => setAccount(true)}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Account</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Active Networks</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Connected Apps</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] mt-4 h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Developers Options</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Community</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">About</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="flex flex-col mt-20 items-center justify-center">
                <img src="/assets/show.png" className="h-12 w-12" />
                <p className="text-[21px] text-white/95 font-semibold">
                  InFuse Wallet
                </p>
                <p>version 1.8.8</p>
              </div>
            </div>
          </div>
        </>
      )}
      {setting && (
        <>
          <div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0 py-2 text-white/70 mb-2 flex-col items-center justify-center w-[100%] h-auto">
            <div className=" bg-slate-50/0 mb-[20px] w-[100%] px-2 flex  ">
              <div
                onClick={() => router.push("/wallet")}
                className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
              >
                <ArrowLeft className="font-bold text-xl" />
              </div>
              <div className="ml-auto mt-1.5 mr-[45%]">
                <p className="text-white text-[16px] font-bold">Settings</p>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => {
                    setSetting(false);
                    setAccount(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Account</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => {
                    setSetting(false);
                    setNetworks(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Active Networks</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div
                  onClick={() => {
                    setSetting(false);
                    setConnect(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Connected Apps</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] mt-4 h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => {
                    setSetting(false);
                    setOptions(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Developers Options</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => {
                    setSetting(false);
                    setCommunity(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Community</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div
                  onClick={() => {
                    setSetting(false);
                    setAbout(true);
                  }}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">About</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="flex flex-col mt-20 items-center justify-center">
                <img src="/assets/show.png" className="h-12 w-12" />
                <p className="text-[21px] text-white/95 font-semibold">
                  InFuse Wallet
                </p>
                <p>version 1.8.8</p>
              </div>
            </div>
          </div>
        </>
      )}
      {account && (
        <>
          <div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0 py-2 text-white/70 mb-2 flex-col items-center justify-center w-[100%] h-auto">
            <div className=" bg-slate-50/0 mb-[20px] w-[100%] px-2 flex  ">
              <div
                onClick={() => {
                  setAccount(false);
                  setSetting(true);
                }}
                className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
              >
                <ArrowLeft className="font-bold text-xl" />
              </div>
              <div className="ml-auto mt-1.5 mr-[45%]">
                <p className="text-white text-[16px] font-bold">Account</p>
              </div>
            </div>

            <div className="w-[98%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
              <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div
                  onClick={() => setAccount(true)}
                  className="w-[100%] py-4 px-5 flex"
                >
                  <p className="text-[18px] ">Account</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Active Networks</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Connected Apps</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] mt-4 h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Developers Options</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">Community</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
                <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
                <div className="w-[100%] py-4 px-5 flex">
                  <p className="text-[18px] ">About</p>
                  <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
                </div>
              </div>
              <div className="flex flex-col mt-20 items-center justify-center">
                <img src="/assets/show.png" className="h-12 w-12" />
                <p className="text-[21px] text-white/95 font-semibold">
                  InFuse Wallet
                </p>
                <p>version 1.8.8</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
