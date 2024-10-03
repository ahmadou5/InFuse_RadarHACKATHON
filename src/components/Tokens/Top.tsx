import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"


interface TopProps {
    tokenId: string;
}
export const Top = ({tokenId}: TopProps) => {

    const router = useRouter()
    return(
        <div className="bg-white/0 w-[96%] mt-2 ml-auto mr-auto py-4 px-2 rounded-lg ">
        <div className=" bg-slate-50/0  mb-[26px] w-[100%] flex  ">
             <div onClick={() => router.back()} className="bg-white/5 flex items-center justify-center w-12 rounded-xl ml-0 h-11">
                <ArrowLeft  className="font-bold text-xl"/>
             </div>
            <div className='ml-auto text-lg mt-2 mr-[40%]'>
            <p>{tokenId}</p>
            </div>
        </div>
        <div className=" bg-slate-50/0 mb-[26px] py-2 px-2 h-[80px] w-[100%] flex  ">
             <div onClick={() => router.back()} className="bg-white/5 flex items-center justify-center w-[90px] rounded-full ml-0 h-[90px]">
                <img className="rounded-full w-[98%] h-[98%]" src={'https://solana-wallet-orcin.vercel.app/assets/5426.png'} />
             </div>
            <div className='ml-auto text-xl font-bold mt-8 mr-2'>
            <p>3077777 SOL</p>
            </div>
        </div>
        </div>
    )
}