import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { TokenService } from "@/lib/services/TokenServices";
import { Tokens } from "@/interfaces/models.interface";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { SolConverter } from "@/lib/helper.lib";
import { useAuth } from "@/context/AuthContext";
import { BN } from "@coral-xyz/anchor";
import { normalizeTokenAmount } from "helius-airship-core";
//import { getSplTokenBalance } from "@/lib/solana.lib";
import { getCompressTokenBalance } from "@/lib/compressed.lib";
interface TopProps {
  tokenId: string;
}

export const CTop = ({ tokenId }: TopProps) => {
  const { user } = useAuth();
  const [bLoading, setBLoading] = useState<boolean>(true);
  const [userBalance, setUserBalance] = useState<BN>();
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
  });
  console.log(tokenId[0], "first");
  const getTokenInfo = async (slug: string) => {
    try {
      // setIsLoading(true);
      // console.log('Fetching token info for slug:', slug);
      const response = await TokenService.getCompressToken(slug);
      //console.log('Token info response:', response);

      if (response?.data && Array.isArray(response.data)) {
        setTokenInfo(response.data);
        console.log("Token info set:", response.data);
        return response.data;
      } else {
        console.error("Invalid token data received:", response);
        setTokenInfo([]);
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      setTokenInfo([]);
    } finally {
      //    setIsLoading(false);
      //alert('done')
    }
  };

  const fetchBalances = async () => {
    try {
      //console.log('gettin bal')
      console.log(tokenInfo[0], "shineee");
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
        //console.log(balance,'hhhhh');
      } else {
        //console.log('spl ne waannan',address,)
        if (!user) return;
        const balance = await getCompressTokenBalance({
          address: user.publicKey,
          mint: tokenId[1],
        });
        console.log(balance.items[0].balance, "balance");

        setUserBalance(normalizeTokenAmount(balance.items[0].balance, 6));
        setUserBalance(normalizeTokenAmount(balance.items[0].balance, 6));
      }
      setBLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
    }
  };

  const fetch = async () => {
    try {
      const tokenDetails = await getTokenInfo(tokenId[1]);
      if (!tokenDetails) return;
      const balance = fetchBalances();
      console.log(balance);
    } catch (error) {
      console.log(error);
    }
  };
  const router = useRouter();

  useEffect(() => {
    fetch();
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
          {tokenId[0] === "solana" ? "SOLANA" : `c${tokenInfo[0]?.name}`}
        </div>
      </div>
      <div className=" bg-slate-50/0 mb-[20px] py-2 px-2 h-[80px] w-[100%] flex  ">
        {tokenId[0] === "solana" ? (
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
          <div>
            {tokenInfo[0] === undefined ? (
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
            )}{" "}
          </div>
        )}

        <div className="ml-auto text-xl font-bold mt-8 mr-2">
          {tokenId[0] === "solana" ? (
            <div className="flex">
              {" "}
              <p className="ml-2 text-4xl mr-2">{`${
                userBalance === undefined ? (
                  <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded-xl"></div>
                ) : (
                  SolConverter(userBalance).toFixed(2)
                )
              }`}</p>
              <p className="mt-3">{` ${
                tokenId[0] === "solana" ? "SOL" : tokenInfo[0]?.name
              }`}</p>
            </div>
          ) : (
            <div>
              {tokenInfo[0] === undefined ? (
                <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
              ) : (
                <div className="flex">
                  {" "}
                  <p className="ml-2 text-4xl mr-2">{`${
                    bLoading ? (
                      <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded-lg"></div>
                    ) : (
                      userBalance?.toFixed(2)
                    )
                  }`}</p>
                  <p className="mt-[11px]">
                    {` ${tokenId[0] === "solana" ? "SOL" : tokenInfo[0]?.name}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
