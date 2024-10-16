"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Tokens } from "@/interfaces/models.interface";
import { getSolPrice, getTokenPrice } from "@/lib/helper.lib";
import { useAuth } from "@/context/AuthContext";
import { TokenService } from "@/lib/services/TokenServices";
import { GeneratePayLink } from "@/lib/Mercuryo.lib";
import { SpinningCircles } from "react-loading-icons";
import { useUtils } from "@telegram-apps/sdk-react";

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
export const RampView = ({ slug }: { slug: string }) => {
  const provider: providerList = [
    {
      name: "Mercuryo",
      about: "Instant one-click purchase.",
      imgUrl: "/assets/mb.svg",
    },
  ];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("Buy");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  //const [userBalance, setUserBalance] = useState<number>(0);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (pRef.current) {
      pRef.current.focus();
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    const newText = parseFloat((e.target as HTMLParagraphElement).textContent || "");
    setAmount(newText);
    console.log("New value:", newText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    // Allow only numbers, backspace, delete, and arrow keys
    if (
      !/^[0-9]$/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const utils = useUtils();
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const [LinkStr, setLinkStr] = useState<string>("");
  const { user } = useAuth();
  const handleGenLink = async (slug: string) => {
    try {
      if (slug === "solana") {
        if (!user) return;
        const Link = await GeneratePayLink({
          tokenName: "SOL",
          amount: amount,
          type: "buy",
          userAddress: user?.publicKey,
        });
        if (Link === undefined) return;
        
        //console.log(Link);
        setLinkStr(Link);
        //setIsLoading(true)
      } else {
        if (!user) return;
        const Link = await GeneratePayLink({
          tokenName: tokenInfo[0].ticker,
          amount: amount,
          type: "buy",
          userAddress: user?.publicKey,
        });
        console.log(Link);
        if (Link === undefined) return;
        setLinkStr(Link);
      }
    } catch (error) {
      console.log(error);
    }
  };
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
  const fetchPrice = async (token: string) => {
    try {
      if (token[0] === "solana") {
        const price = await getSolPrice('solana');
        setPrice(price)
        console.log(price);
      } else {
        const price = await getTokenPrice(token[0]);
        setPrice(price);
        console.log(price);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetch = async () => {
    try {
      const price = fetchPrice(slug[0]);
      console.log(price, "price thoug");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch();
    getTokenInfo(slug);
    console.log(slug);
  }, []);
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
              <p className="font-light text-xl">
                Buy {slug[0] === "solana" ? "SOL" : tokenInfo[0]?.name}
              </p>
            </div>
          </div>
          <div>
            <div className="w-[98%] mt-4 mb-[80px] ml-auto mr-auto h-[430px] py-3 px-2 flex flex-col items-center justify-center border border-[#448cff]/0 rounded-2xl bg-black/40">
              <div className=" text-white rounded-xl flex items-center justify-center h-16">
                <img
                  src={
                    slug[0] === "solana"
                      ? "/assets/sol.png"
                      : tokenInfo[0]?.logoUrl
                  }
                  className="h-8 rounded-full mr-2 w-8"
                />
                <p

                  ref={pRef}
                  className="text-white max-w-xs outline-none text-5xl"
                  contentEditable
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                  inputMode="numeric"
                  suppressContentEditableWarning
                ></p>
                {/* <inputborer
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
                  className="outline-none bg-transparent text-start text-5xl h-[100%] max-w-[50vw]"
                /> */}
                {/**<p className="mt-5 text-2xl font-light ml-1 mr-auto">$</p> **/}
              </div>
              <div className="bg-black/0 rounded-2xl w-[150px] ml-auto mr-auto mt-12 mb-[90px] flex  items-center justify-center h-9">
                <p className="text-white text-3xl text-center py-0.5">
                  {`$${amount * price}`}
                </p>
              </div>
              <div className="mb-[80px] w-[100%] flex items-center justify-center">
                <div
                 onClick={() => {
                  const amount = 50 / price
                  setAmount(amount)
                 if (pRef.current) pRef.current.innerText = amount.toFixed(2).toString()
                }}
                  className="ml-auto mr-8 bg-white/10 flex items-center justify-center rounded-2xl h-9 w-[24%]"
                >
                  $50
                </div>
                <div
                    onClick={() => {
                      const amount = 100 / price
                      setAmount(amount)
                     if (pRef.current) pRef.current.innerText = amount.toFixed(2).toString()
                    }}
                  className="ml-0 mr-0 bg-white/10 flex items-center justify-center rounded-2xl h-9 w-[24%]"
                >
                  $100
                </div>
                <div
                  onClick={() => {
                    const amount = 500 / price
                    setAmount(amount)
                   if (pRef.current) pRef.current.innerText = amount.toFixed(2).toString()
                  }}
                  className="ml-8 mr-auto bg-white/10 flex items-center justify-center rounded-2xl h-9 w-[24%]"
                >
                  $500
                </div>
              </div>
              <div className="mt-[0px] w-[100%]">
                {isValid ? (
                  <div
                    onClick={() => {
                      //handleGenLink(slug[0])
                      setIsLoading(true);
                      console.log(LinkStr);
                      utils.openLink(LinkStr, { tryInstantView: true });
                      setTimeout(() => {
                        setIsLoading(false);
                        setIsValid(false);
                      }, 6000);
                    }}
                    className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/50 h-14 flex items-center"
                  >
                    <div className="ml-auto mr-auto">
                      {isLoading ? (
                        <SpinningCircles className="h-5 w-5" />
                      ) : (
                        "Continue"
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      handleGenLink(slug[0]);
                      setIsValid(true);
                    }}
                    className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/50 h-14 flex items-center"
                  >
                    <div className="ml-auto mr-auto">Validate</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
