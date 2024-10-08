import { useMini } from "@/context/MiniContext";
import { useEffect, useState } from "react";
import { Tokens } from "@/interfaces/models.interface";
import { TokenService } from "@/lib/services/TokenServices";
import { getSplTokenBalance } from "@/lib/solana.lib";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { SpinningCircles } from "react-loading-icons";
import { useAuth } from "@/context/AuthContext";
import { compressToken } from "@/lib/compressed.lib";
import toast, { Toaster } from "react-hot-toast";


export const Card = ({ tokenId }: { tokenId: string }) => {
  const {user} = useAuth()
  const { setIsCompressed } = useMini();
  const [amount,setAmount] = useState<number>(0)
  const [tokenBalance,setTokenBalance] = useState<number>(0)
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  

  
  const handleCompression = async () => {
    try {
      if(!user) return
      setIsLoading(true)
      setTimeout(() => {
        setIsFirst(false)
        toast.success('Compress Success')
      },5000)
      let ownerPubKey: PublicKey;
      try {
      ownerPubKey = new PublicKey(tokenInfo[0].owner);
      } catch (error) {
       throw new Error("Invalid sender address");
      }
      let addressPubKey: PublicKey;
      try {
      addressPubKey = new PublicKey(tokenInfo[0].address);
      } catch (error) {
       throw new Error("Invalid sender address");
      }
      const result = compressToken({
        userMnemonic: user.mnemonic,
        splAddress: addressPubKey,
        owner: ownerPubKey,
        amount: amount
      })
   
      
      console.log(result)
    } catch (error: unknown) {
      if(error instanceof Error)console.log(error.message)
    }

  }
  const getTokenInfo = async (slug:string) => {
    try {
      console.log('token deeeeeetails')
      const response = await TokenService.getTokenBytoken_id(slug);
     
     if (response.data && Array.isArray(response.data)) {
       setTokenInfo(response.data);
       console.log(response,'anan ne')
     } else {
       console.error('Invalid token data received:', response);
       setTokenInfo([]); // Set to empty array if data is invalid
     }
   } catch (error) {
     console.error('Failed to fetch tokens:', error);
     setTokenInfo([]); // Set to empty array on error
   }
  }


  const getTokenBalance = async () => {
    try {
      if(!user) return
      const connection = new Connection(clusterApiUrl('devnet'),{commitment:'confirmed'});
      const balance = await getSplTokenBalance(connection, 'DYcWQh7rEXJbd9bynvisTn9WgQ7HWXZN6jk7sRmAjMaw',user.publicKey )
      setTokenBalance(balance)
      console.log(balance)
    } catch (error) {
      
    }
}


  useEffect(() => {
    getTokenInfo(tokenId);
    getTokenBalance()
  }, []);
  return (
    <div className="w-[100%] min-h-screen flex items-center justify-center inset-0 bg-opacity-100 z-[99999999] h-auto backdrop-blur-sm fixed">
      <div className="h-[350px] rounded-3xl  w-[94%] bg-white/30">
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
                <p className="ml-1 font-light mr-4">Compress</p>
                {tokenInfo[0] === undefined ? (
                  <div className="bg-white/20 h-[25px] w-[90px]  animate-pulse rounded"></div>
                ) : (
                  <p className="font-semibold">{tokenInfo[0]?.name}</p>
                )}
              </div>
              <div className=" bg-slate-50/0 mb-[20px] w-[100%] flex py-3 px-2 ">
                <div className="border mt-7 flex items-center px-2 justify-center ml-auto mr-auto h-14 w-[98%] border-white/45 rounded-lg">
                   <input
                  type="number"
                  id="pin"
                  name="pin"
                  value={amount}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.valueAsNumber) }
                  placeholder="Enter Amount"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  security='yes'
                  maxLength={8}
                  
                  className="outline-none bg-transparent text-xl ml- w-[93%] h-9 "
                
                />
                  <div onClick={() => setAmount(tokenBalance)} className="w-[18%] h-[80%] flex items-center justify-center mt-0.5 bg-black rounded-2xl ">
                    Max
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[80%] ml-auto mr-auto">
              <div
                onClick={() => handleCompression()}
                className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/50 h-14 flex items-center"
              >
                {isLoading ? <SpinningCircles className="ml-auto mr-auto h-7 w-7" /> : <p className="ml-auto mr-auto">Continue</p>}
              </div>
            </div>
          </>
        ) : (
          <>
           <div className="w-[98%] ml-auto py-3 px-2 mr-auto ">
              <div className=" bg-slate-50/0 mb-[20px] h-[200px] items-center justify-center w-[100%] flex py-3 px-2 ">
                <img src="/assets/good.svg" className="h-[80%] w-[80%]" />
              </div>
            </div>
            <div className="w-[80%] ml-auto mr-auto">
              <div
                onClick={() => setIsCompressed(false)}
                className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/50 h-14 flex items-center"
              >
                <p className="ml-auto mr-auto">Continue</p>
              </div>
            </div>
          </>
        )}
      </div>
      <Toaster/>
    </div>
  );
};
