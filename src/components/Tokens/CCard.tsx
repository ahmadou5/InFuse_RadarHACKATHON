import { useMini } from "@/context/MiniContext";
import { useEffect, useState } from "react";
import { Tokens } from "@/interfaces/models.interface";
//import { TokenService } from "@/lib/services/TokenServices";
//import { getSplTokenBalance } from "@/lib/solana.lib";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { SpinningCircles } from "react-loading-icons";
import { useAuth } from "@/context/AuthContext";
import { decompressToken, getCompressTokenBalance } from "@/lib/compressed.lib";
import toast, { Toaster } from "react-hot-toast";

//import { createAndMintToken } from "@/lib/helper.lib";
import { useNetwork } from "@/context/NetworkContext";
import { Token } from "@/utils/tokens.utils";
import { normalizeTokenAmount } from "helius-airship-core";

export const CCard = ({ tokenId }: { tokenId: string }) => {
  const { user } = useAuth();
  const { network } = useNetwork();
  const { setIsCompressed } = useMini();
  const [amount, setAmount] = useState<number>(0);
  //const [mintAu,setMintAu] = useState<string>('')
  //const [mintAd,setMintAd] = useState<string>('')
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);

  const connection = new Connection(
    !network.isEVM ? network.rpcUrl || "" : clusterApiUrl("devnet"),
    {
      commitment: "confirmed",
    }
  );
  console.log(tokenId, "address");
  console.log(tokenBalance);
  const getTokenInfo = async (slug: string) => {
    try {
      console.log("gett");
      // setIsLoading(true);
      // console.log('Fetching token info for slug:', slug);
      const response = Token.filter((token) => token.compress_address === slug);
      console.log("Token info response:", response);

      if (response && Array.isArray(response)) {
        setTokenInfo(response);
        console.log("Token info set:", response);
        return response;
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
        setTokenBalance(balance);
        //console.log(balance,'hhhhh');
      } else {
        //console.log('spl ne waannan',address,)
        if (!user) return;
        const balance = await getCompressTokenBalance({
          address: user.publicKey,
          mint: tokenId[1],
          rpc: network.rpcUrl || "",
        });
        console.log(balance.items[0].balance, "balance");

        setTokenBalance(normalizeTokenAmount(balance.items[0].balance, 6));
        //setUserBalance(normalizeTokenAmount(balance.items[0].balance, 6));
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
    }
  };

  const fetch = async () => {
    try {
      const tokenDetails = await getTokenInfo(tokenId[1]);
      console.log("fetched ohhh");
      if (!tokenDetails) return;
      //setMintAu(tokenDetails[0]?.owner)
      //setMintAd(tokenDetails[0]?.address)
      const balance = fetchBalances();
      console.log(balance);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeCompression = async () => {
    try {
      if (!user) return;
      setIsLoading(true);
      const tokenDetails = await getTokenInfo(tokenId[1]);
      if (!tokenDetails) return;
      let addressPubKey: PublicKey;
      try {
        addressPubKey = new PublicKey(tokenDetails[0]?.compress_address);
      } catch (error) {
        throw new Error("Invalid sender Receiverrr");
      }
      const result = await decompressToken({
        splAddress: addressPubKey,
        amount: amount,
        userAddress: user.publicKey,
        rpc: network.rpcUrl || "",
      });

      if (result?.success)
        setTimeout(() => {
          setIsFirst(false);
          toast.success("Compress Success");
        }, 5000);
      else {
        setIsFirst(true);
        setIsLoading(false);
        toast.error(`Error: ${result?.data?.toString()}`);
      }
      console.log(result);
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      setIsFirst(true);
    }
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <div className="w-[100%] min-h-screen flex items-center justify-center inset-0 bg-opacity-100 z-[99999999] h-auto backdrop-blur-sm fixed">
      <div className="h-[390px] rounded-3xl  w-[94%] bg-white/30">
        {isFirst ? (
          <>
            <div className="w-[98%] ml-auto py-3 px-2 mr-auto ">
              {tokenInfo[0] === undefined ? (
                <></>
              ) : (
                <div className="mt-2 ml-auto mr-auto rounded-md mb-2 w-16 flex items-center justify-center h-16">
                  <img className="rounded-2xl" src={tokenInfo[0].logoUrl} />
                </div>
              )}
              <div className="flex items-center text-2xl justify-center mt-2 text-white/75 ml-auto mr-auto">
                <p className="ml-1 font-light mr-4">DeCompress</p>
                {tokenInfo[0] === undefined ? (
                  <div className="bg-white/20 h-[25px] w-[90px]  animate-pulse rounded"></div>
                ) : (
                  <p className="font-semibold">{`c${tokenInfo[0]?.name}`}</p>
                )}
              </div>
              <div className=" bg-slate-50/0 mb-[20px] w-[100%] flex py-3 px-2 ">
                <div className="border mt-7 flex items-center px-2 justify-center ml-auto mr-auto h-14 w-[98%] border-white/45 rounded-lg">
                  <input
                    type="number"
                    id="pin"
                    name="pin"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAmount(e.target.valueAsNumber)
                    }
                    placeholder="Enter Amount"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    security="yes"
                    maxLength={8}
                    className="outline-none bg-transparent text-xl ml- w-[93%] h-9 "
                  />
                  <div
                    onClick={() => setAmount(tokenBalance)}
                    className="w-[18%] h-[80%] flex items-center justify-center mt-0.5 bg-black rounded-2xl "
                  >
                    Max
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[90%] mt-12 flex ml-auto mr-auto">
              <div
                onClick={() => setIsCompressed(false)}
                className="w-[45%] ml-auto mr-auto py-1 border border-[#448cff]/0 rounded-xl bg-black/90 h-12 flex items-center"
              >
                <p className="ml-auto mr-auto">Close</p>
              </div>
              <div
                onClick={() => handleDeCompression()}
                className="w-[45%] ml-auto mr-auto py-1 border border-[#448cff]/0 rounded-xl bg-white/70 h-12 flex items-center"
              >
                {isLoading ? (
                  <SpinningCircles className="ml-auto text-black mr-auto h-7 w-7" />
                ) : (
                  <p className="ml-auto mr-auto text-black">Compress</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-[98%] ml-auto py-3 mb-5 px-2 mr-auto ">
              <div className=" bg-slate-50/0 mb-[8px] h-[200px] items-center justify-center w-[100%] flex py-3 px-2 ">
                <img src="/assets/good.svg" className="h-[80%] w-[80%]" />
              </div>
            </div>
            <div className="ml-auto mr-auto flex items-center justify-center">
              <p>{`You DeCompressed ${amount} of c${tokenInfo[0].name}`}</p>
            </div>
            <div className="w-[80%] ml-auto mt-8 mr-auto">
              <div
                onClick={() => setIsCompressed(false)}
                className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/50 h-14 flex items-center"
              >
                <p className="ml-auto mr-auto">Close</p>
              </div>
            </div>
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
};
