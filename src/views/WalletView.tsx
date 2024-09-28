"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
//import { MdKeyboardArrowDown } from "react-icons/md";
import { Menu } from "@/components/Menu/Menu";
interface token {
  name: string;
  ticker: string;
  id: string;
  getId: string;
  imgUrl: string;
}
[];

interface TeamList extends Array<token> {}
export const WalletView = () => {
  const {logout} = useAuth()
  const [activeTab, setActiveTab] = useState("Tokens");
  const router = useRouter()
  const token1: TeamList = [
    {
      name: 'Bonk',
      ticker: 'bonk',
      id: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      getId: 'bonk',
      imgUrl: 'https://coin-images.coingecko.com/coins/images/28600/large/bonk.jpg?1696527587'
    },
  ];
  return (
    <div className="w-[100%]">
      <div className="bg-gothic-950/0 mt-0.5 flex  mb-2 flex-col items-center justify-center w-[100%] h-auto">
        <div className="mt-0.5 mb-4 w-full flex">
          <div onClick={() => router.replace('/settings') } className="w-[50px] h-[50px] p-2 mr-1.5 ml-auto flex items-center justify-center rounded-full">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/setting.svg"
              className="text-white"
            />
          </div>
        </div>
        <div className="bg-s-gray-300/0 w-[90%] flex flex-col items-center justify-center rounded-3xl h-[120px]">
          <p className="text-[22px] font-light text-[#666666] mb-2.5">
            Total Balance
          </p>
          <p className="text-5xl font-bold text-white/65">{`$${399}`}</p>
        </div>
      </div>
      <div className="bg-gothic-950/0 mt-3 flex items-center justify-center w-[100%] h-auto">
        <div className="bg-gothic-300/0 w-[90%] flex items-center justify-center rounded-3xl h-[100px]">
          <div onClick={() => router.push(`/send/solana`)} className="text-xl bg-white/10  border-[#448cff]/25 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/send.svg"
              className="mt-1"
            />
            <p className="text-sm mt-2.5 text-white/50 font-light ">Send</p>
          </div>
          <div onClick={() => router.push(`/receive`)} className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/qr.svg"
              className="mt-1"
            />
            <p className="text-sm mt-2.5 text-white/50 font-light">Receive</p>
          </div>
          <div className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/dollar.svg"
              className="mt-1"
            />
            <p className="text-sm mt-2.5 text-white/50 font-light">Buy</p>
          </div>
        </div>
      </div>

      <div className="bg-gothic-950/0 mt-8 flex flex-col items-center justify-center w-[100%] h-auto">
        <div className="flex justify-around mb-6 bg-white/0 bg-opacity-10 rounded-xl p-1">
          {["Tokens", `NFT's`].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-6 rounded-lg  ml-2 mr-2 text-sm font-medium ${
                activeTab.toLowerCase() === tab.toLowerCase()
                  ? "bg-white/10 bg-opacity-20 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="bg-white/10 w-[90%] mb-1.5 flex items-center justify-center rounded-xl h-[70px]">
          <div className="bg-gothic-600/85 w-12 flex items-center justify-center h-12 ml-[23px] mr-[10px] rounded-full">
            <img
              src={"https://solana-wallet-orcin.vercel.app/assets/5426.png"}
              className="text-white/90 w-full h-full rounded-full text-2xl"
            />
          </div>
          <div className="ml-[5px] text-white/85 mr-auto px-3">
            <p className="text-sm font-bold mb-1">{"Solana"}</p>
            <p className="text-sm">{`2 SOL`}</p>
          </div>
          <div className="ml-[10px]  text-white/85 mr-4 px-3">
            <p className="text-[15px] mb-1">{`$${300}`}</p>
            <p className="text-[15px] ">{`$${60}`}</p>
          </div>
        </div>
        {token1 &&
          token1.map((token, i) => (
            <>
              <div
                onClick={() => router.push(`/token/${token.ticker}`)}
                key={i}
                className="bg-white/10 w-[90%] mb-1.5 flex items-center justify-center rounded-xl h-[70px]"
              >
                <div className="bg-gothic-600/85 w-12 flex items-center justify-center h-12 ml-[23px] mr-[10px] rounded-full">
                  <img
                    src={
                      token.imgUrl
                    }
                    className="text-white/90 w-full h-full rounded-full text-2xl"
                  />
                </div>
                <div className="ml-[5px] text-white/85 mr-auto px-3">
                  <p className="text-sm font-bold mb-1">{token.name}</p>
                  <p className="text-sm">{`${233} ${token.ticker}`}</p>
                </div>
                <div className="ml-[10px]  text-white/85 mr-4 px-3">
                  <p className="text-[15px] mb-1">{`$${30}`}</p>
                  <p className="text-[15px] ">{`$${20}`}</p>
                </div>
              </div>
            </>
          ))}
        <div
          onClick={() => logout()}
            className={`w-[199px] mb-[200px]  ml-1 mr-auto py-1  px-3 flex  items-center justify-center bg-black/0 rounded-full h-8`}
        >
          <p className="text-[#448DFC] font-light text-[14px] ml-auto mr-auto ">
            + Add Custom token
          </p>
        </div>
      </div>
      <Menu />
    </div>
  );
};
