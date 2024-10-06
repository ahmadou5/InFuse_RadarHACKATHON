import { useAuth } from "@/context/AuthContext"

import { getCompressTokenBalance } from "@/lib/compressed.lib"
import { PublicKey } from "@solana/web3.js"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { useRouter } from "next/navigation"
export const Activities = ({slug}: Params) => {

    const { user } = useAuth()
    

    const router = useRouter()
    
    const HandleMint = () => {
      
      try {
        if(!user) {
          return
        }
        let userPubKey: PublicKey;
        try {
          userPubKey = new PublicKey(user.publicKey);
        } catch (error) {
          throw new Error("Invalid sender address");
        }
        getCompressTokenBalance({address: userPubKey })
      } catch (error) {
        console.log(error)
      }
    }
    return(
    <>
     
        <div className="bg-gothic-300/0 w-[90%] ml-auto mr-auto mb-5 flex items-center justify-center rounded-3xl h-[100px]">
          <div onClick={() => router.replace(`/send/${slug}`)} className="text-xl bg-white/10  border-[#448cff]/25 flex flex-col items-center justify-center rounded-3xl h-16 w-16 ml-auto mr-auto  text-white/60">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/send.svg"
              className="mt-1"
            />
            
          </div>
          <div className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-16 w-16 ml-auto mr-auto  text-white/60">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/qr.svg"
              className="mt-1"
            />
          </div>
          <div className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-16 w-16 ml-auto mr-auto  text-white/60">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/dollar.svg"
              className="mt-1"
            />
           
          </div>
          <div onClick={() => HandleMint() } className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-16 w-16 ml-auto mr-auto  text-white/60">
            <img
              src="/assets/comp.svg"
              className="mt-1"
            />
           
          </div>
        </div>
    </>
)
}