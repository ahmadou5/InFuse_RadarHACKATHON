"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tokens } from "@/interfaces/models.interface";
import { useAuth } from "@/context/AuthContext";
import { TokenService } from "@/lib/services/TokenServices";
import { GeneratePayLink } from "@/lib/Mercuryo.lib";
import { SpinningCircles } from "react-loading-icons";

interface Provider {
  name: string;
  about: string;

  imgUrl: string;
}

type providerList = Provider[];
interface ProviderItemProps {
  providerName: string | undefined;
  providerAbout: string | undefined;
  imgUrl: string | undefined;
  onClick: () => void;
}
const ProviderItem: React.FC<ProviderItemProps> = ({
  providerName,
  providerAbout,
  imgUrl,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-white/10 w-[94%] px-2 py-5 ml-auto mr-auto mb-1.5 flex items-center justify-center rounded-xl h-[120px] cursor-pointer"
  >
    <div className="bg-white w-[20%] flex items-center  rounded-2xl justify-center h-[93%] ml-[5px] mr-[10px] ">
      <img
        src={imgUrl}
        alt={providerName}
        className="w-[100%] h-[100%] rounded-2xl"
      />
    </div>
    <div className="ml-[7px] py-3 text-white/95 w-[60%] mr-auto px-3">
      <p className="mb-2 w-[100%] text-xl">{providerName}</p>
      <p className="text-sm w-[93%] font-light text-white/75">
        {providerAbout}
      </p>
    </div>
  </div>
);
export const RampView = ({slug}: {slug:string}) => {
  const provider: providerList = [
    {
      name: "Mercuryo",
      about:
        "Instant one-click purchase.",
      imgUrl: "/assets/mb.svg",
    },
  ];
  const router = useRouter();
  const [isLoading,setIsLoading] = useState<boolean>(false)
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("Buy");
  const [amount, setAmount] = useState<number>(0);
  //const [userBalance, setUserBalance] = useState<number>(0);
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const { user } = useAuth()
  const handleGenLink =  async (slug: string) => {
    try {
      if(slug[0] === 'solana') {
       if(!user) return
       const Link = GeneratePayLink({
        tokenName: 'SOL',
        amount: amount,
        type: 'buy',
        userAddress: user?.publicKey
       })
      console.log(Link)
      setIsLoading(true)
      setInterval(() => {
        if(!Link) return
        router.push(Link)
        setIsLoading(false)
      }, 3000);
      } else { 
        if(!user) return
        const Link = GeneratePayLink({
        tokenName: tokenInfo[0].ticker,
        amount: amount,
        type: 'buy',
        userAddress: user?.publicKey
      })
      console.log(Link)
      setIsLoading(true)
      setInterval(() => {
        if(!Link) return
        window.open(Link)
        setIsLoading(false)
      }, 3000);
      }
    } catch (error) {
      
    }
  }
  const getTokenInfo = async (slug: string) => {
    try {
      //console.log("token etails");
      
      const response = await TokenService.getTokenBytoken_id(slug);

      if (response.data && Array.isArray(response.data)) {
        setTokenInfo(response.data);
        console.log(response, "anan ne");
      } else {
        console.error("Invalid token data received:", response);
        setTokenInfo([]); // Set to empty array if data is invalid
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      setTokenInfo([]); // Set to empty array on error
    }
  };
  useEffect(() => {
    getTokenInfo(slug)
    console.log(slug)
  },[])
  return (
    <div className=" px-1 py-3  bg-red-600/0 h-[85%] flex flex-col rounded-xl w-[100%] ml-auto mr-auto">
      {isFirst ? (
        <>
          <div className=" bg-slate-50/0 w-[100%] flex  ">
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
            {activeTab === "Buy" ? (
              <>
                {provider.map((item, i) => (
                  <ProviderItem
                    key={i}
                    providerName={item.name}
                    providerAbout={item.about}
                    imgUrl={item.imgUrl}
                    onClick={() => {
                      setIsFirst(false);
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
                      setIsFirst(false);
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="w-[100%] h-[100%] bg-red-600/0">
          <div className=" bg-slate-50/0 mb-[100px] w-[100%] flex py-3 px-2 ">
            <div
              onClick={() => setIsFirst(true)}
              className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
            >
              <ArrowLeft className="font-bold text-xl" />
            </div>
            <div className="ml-auto mt-0.5 mr-[38%]">
              <p className="font-light text-xl">Buy {slug[0] === 'solana' ? 'SOL' : tokenInfo[0]?.name}</p>
            </div>
          </div>
          <div>
            <div className="w-[98%] mt-4 mb-[80px] ml-auto mr-auto h-[430px] py-3 px-2 flex flex-col items-center justify-center border border-[#448cff]/0 rounded-2xl bg-black/40">
              <div className="w-[100%] ml-auto mr-auto text-white rounded-xl  flex  h-16">
                <p className="mt-5 text-2xl font-light ml-auto mr-2">$</p>
                <input
                  type="number"
                  id="pin"
                  name="pin"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAmount(e.target.valueAsNumber)
                  }
                  placeholder="0"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  security="yes"
                  maxLength={8}
                  className="outline-none bg-transparent text-start text-5xl w-[54%] h-[100%] "
                />
                {/**<p className="mt-5 text-2xl font-light ml-1 mr-auto">$</p> **/}
              </div>
              <div className="bg-black/0 rounded-2xl w-[150px] mt-12 mb-[90px] flex  h-9">
                <div className="h-[95%] w-[23%] ml-2 mr-3">
                  <img src={slug[0] === 'solana' ? "/assets/sol.png" : tokenInfo[0]?.logoUrl} className="h-[100%] w-[100%]" />
                </div>
                <p className="text-white text-3xl text-center py-0.5">
                  {`$${amount}`}
                </p>
                <p className="text-white text-xl ml-1 text-center py-2">{slug[0] === 'solana' ? 'SOL' : tokenInfo[0]?.name}</p>
              </div>
              <div className="mb-[80px] w-[100%] flex items-center justify-center">
                <div onClick={() => setAmount(30)} className="ml-auto mr-8 bg-white/10 flex items-center justify-center rounded-2xl h-9 w-[24%]">$30</div>
                <div onClick={() => setAmount(100)} className="ml-0 mr-0 bg-white/10 flex items-center justify-center rounded-2xl h-9 w-[24%]">$100</div>
                <div onClick={() => setAmount(500)} className="ml-8 mr-auto bg-white/10 flex items-center justify-center rounded-2xl h-9 w-[24%]">$500</div>
              </div>
              <div className="mt-[0px] w-[100%]">
              <div onClick={() => handleGenLink(slug[0]) } className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/50 h-14 flex items-center">
              <div className="ml-auto mr-auto">{isLoading ? <SpinningCircles className="h-5 w-5"/> : 'Continue'}</div>
            </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
