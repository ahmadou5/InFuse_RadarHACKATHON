"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface Provider {
  name: string;
  about: string;
  url: string;
  imgUrl: string;
}



type providerList = Provider[];
interface ProviderItemProps {
  providerName: string|undefined;
  providerAbout: string|undefined;
  imgUrl: string|undefined;
  onClick: () => void;
}
const ProviderItem: React.FC<ProviderItemProps> = ({ providerName, providerAbout,imgUrl, onClick }) => (
  <div onClick={onClick} className="bg-white/10 w-[94%] ml-auto mr-auto mb-1.5 flex items-center justify-center rounded-xl h-[150px] cursor-pointer">
    <div className="bg-gothic-600/85 w-20 flex items-center justify-center h-20 ml-[23px] mr-[10px] rounded-full">
      <img src={imgUrl} alt={providerName} className="text-white/90 w-full h-full rounded-full" />
    </div>
    <div className="ml-[7px] text-white/95 mr-auto px-3">
      <p className="mb-2 text-xl">{providerName}</p>
      <p className="text-sm w-[93%] font-light text-white/75">{providerAbout}</p>
    </div>
  </div>
);
export const RampView = () => {
  const provider:providerList = [
    {
       name: 'Mercuryo',
       about: 'Instant one-click purchase up to 1000 usd with no KYC, using bank card, Apple pay,Google Pay,or SEPA. ',
       url: 'ggg',
       imgUrl: '/assets/comp.svg'
    }
  ]
  const router = useRouter();
  const [isFirst,setIsFirst] = useState(true)
  const [activeTab, setActiveTab] = useState("Buy");
  return (
    <div className=" px-1.5 py-4  bg-red-600/0 h-[85%] flex flex-col rounded-xl w-[100%] ml-auto mr-auto">
      {
        isFirst ?  (<><div className=" bg-slate-50/0 w-[100%] flex  ">
        <div
          onClick={() => router.back()}
          className="bg-white/5 flex items-center justify-center w-12 rounded-full ml-1 mr-[110px] h-11"
        >
          <ArrowLeft className="font-bold text-xl" />
        </div>
       <p className="mt-2 text-md mr-auto ml-3">Ramp</p>
      </div>
      <div className="mt-10 bg-white/0 w-[100%] h-auto">
      <div className="flex justify-around mb-6 bg-white/0 bg-opacity-10 rounded-xl p-1">
          {["Buy", "Sell"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-6 rounded-lg ml-2 mr-2 text-sm font-medium ${
                activeTab.toLowerCase() === tab.toLowerCase()
                  ? "bg-white/10 bg-opacity-20 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 'Buy' ? (
          <>
            {provider.map((item, i) => (
              <ProviderItem
                key={i}
                providerName={item.name}
                providerAbout={item.about}
                imgUrl={item.imgUrl}
                onClick={() => {
                  setIsFirst(true)
                }}
              />
            ))}
            
          </>
        ) : (
          <>
          {provider.map((item, i) => (
              <ProviderItem
                key={i}
                providerName={item.name}
                providerAbout={item.about}
                imgUrl={item.imgUrl}
                onClick={() => {
                  setIsFirst(true)
                }}
              />
            ))}
            </>
        )}
     </div></>) : (
      <>
      <div className="w-[100%] h-[100%] bg-red-600">
hey
      </div>
      </>
    )
       }
    </div>
  );
};
