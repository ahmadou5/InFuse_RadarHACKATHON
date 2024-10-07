import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { TokenService } from "@/lib/services/TokenServices";
import { Tokens } from "@/interfaces/models.interface";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { SolConverter } from "@/lib/helper.lib";
import { useAuth } from "@/context/AuthContext";
import { getSplTokenBalance } from "@/lib/solana.lib";
interface TopProps {
  tokenId: string;
}

export const Top = ({ tokenId }: TopProps) => {
  const { user } = useAuth();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
  });
  const getTokenInfo = async (slug: string) => {
    try {
      //console.log("token etails");
      const response = await TokenService.getTokenBytoken_id(slug);

      if (response.data && Array.isArray(response.data)) {
        setTokenInfo(response.data);
        //console.log(response, "anan ne");
      } else {
        console.error("Invalid token data received:", response);
        setTokenInfo([]); // Set to empty array if data is invalid
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      setTokenInfo([]); // Set to empty array on error
    }
  };
  
  const fetchBalances = async () => {
    try {
      if (tokenId[0] === "solana") {
        if (!user) return;
        let userPubKey: PublicKey;
        try {
          userPubKey = new PublicKey(user.publicKey);
        } catch (error) {
          throw new Error("Invalid sender address");
        }

        const balance = await connection.getBalance(userPubKey);
        setUserBalance(balance);
        console.log(balance,'hhhhh');
      } else {
        if (!user) return;
        const balance = await getSplTokenBalance(
          connection,
          tokenInfo[0].address,
          user?.publicKey
        );
        console.log(balance);
        setUserBalance(balance);
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
    }
  };
  const router = useRouter();
  
  useEffect(() => {
    getTokenInfo(tokenId);
    fetchBalances();
  }, [user]);
  return (
    <div className="bg-white/0 w-[96%] mt-2 ml-auto mr-auto py-1 px-2 rounded-lg ">
      <div className=" bg-slate-50/0  mb-[26px] w-[100%] flex  ">
        <div
          onClick={() => router.back()}
          className="bg-white/5 flex items-center justify-center w-12 rounded-xl ml-0 h-11"
        >
          <ArrowLeft className="font-bold text-xl" />
        </div>
        <div className="ml-auto text-lg mt-2 mr-[41%]">
          {tokenId[0] === "solana" ? "SOLANA" : tokenInfo[0]?.name}
        </div>
      </div>
      <div className=" bg-slate-50/0 mb-[20px] py-2 px-2 h-[80px] w-[100%] flex  ">
        {
          tokenId[0] === 'solana' ? (
            <div className="bg-white/5 flex items-center ml-7 justify-center w-[70px] rounded-full h-[70px]">
            <img
              className="rounded-full w-[98%] h-[98%]"
              src={
                tokenId[0] === "solana"
                  ? "https://solana-wallet-orcin.vercel.app/assets/5426.png"
                  : tokenInfo[0]?.logoUrl
              }
            />
          </div>
          ) : (
            <div>{tokenInfo[0] === undefined ? (
              <div className="bg-white/20 h-[70px] w-[70px] ml-7 mb-2 animate-pulse rounded"></div>
            ) : (
              <div className="bg-white/5 flex items-center ml-7 justify-center w-[70px] rounded-full h-[70px]">
                <img
                  className="rounded-full w-[98%] h-[98%]"
                  src={
                    tokenId === "solana"
                      ? "https://solana-wallet-orcin.vercel.app/assets/5426.png"
                      : tokenInfo[0]?.logoUrl
                  }
                />
              </div>
            )} </div>
          )
        }
       

        <div className="ml-auto text-xl font-bold mt-8 mr-2">
          {
            tokenId[0] === 'solana' ? (
              <div className="flex"> <p className="ml-2 text-4xl mr-2">{`${SolConverter(userBalance).toFixed(2)}`}</p>
              <p className="mt-3">{` ${
                tokenId[0] === "solana" ? "SOL" : tokenInfo[0]?.name
              }`}</p>
              </div>
            ) : (<div>
              {tokenInfo[0] === undefined ? (
            <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
          ) : (
            <div className="flex"> <p className="ml-2 text-4xl mr-2">{`${SolConverter(userBalance).toFixed(2)}`}</p>
            <p className="mt-[11px]">
            {` ${
                tokenId[0] === "solana" ? "SOL" : tokenInfo[0]?.name
              }`}
            </p>
            </div>
          )}
            </div>)
          }
          
        </div>
      </div>
    </div>
  );
};
