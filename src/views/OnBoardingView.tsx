'use client'
//import { SolanaWalletInfo } from "@/lib/solana.lib"
import { useRouter } from "next/navigation"

//import Image from "next/image"
import { ArrowRight, CircleGauge, ShieldCheck } from "lucide-react"
export const OnboardView = () => {
   
    const router = useRouter()
    return(
    <div className="w-[100%]">
                <div className="w-[100%] flex flex-col p-5 h-[100%]">
                  <div className="mt-[98px] w-[100%] flex flex-col items-start justify-start">
                    <div className="text-[25px] ml-auto mr-3 font-light w-[100%]">
                        Welcome
                        to
                        <p className="text-blue-800 text-4xl font-light">InFuse Wallet</p>
                        
                    </div>
                   <div className="flex w-[100%] mt-10 py-2 px-4 h-[100px]  bg-white/5 bg-opacity-2 rounded-xl">
                      <div  className="h-[100%] flex items-center justify-center w-[30%]">
                        <CircleGauge className="text-blue-800/55 w-14 h-14" />
                      </div>
                      <div  className="h-[100%] flex flex-col items-start justify-center px-4">
                       <p className="text-white text-[16px] mb-1">Fast and Cheap</p>
                        <p className="text-white/65 text-sm">stuffsa that tells about how easily you can get onboareded</p>
                      </div>
                   </div>
                   <div className="flex w-[100%] py-2 px-4 mt-5 h-[100px] bg-white/5 bg-opacity-2 rounded-xl">
                   <div  className="h-[100%] flex  items-center justify-center w-[30%]">
                        <ShieldCheck className="text-blue-800/55 w-14 h-14" />
                      </div>
                      <div  className="h-[100%] flex flex-col items-start justify-center px-4">
                       <p className="text-white text-[16px] mb-1">Secured</p>
                        <p className="text-white/65 text-sm">stuffsa that tells about how easily you can get onboareded</p>
                      </div>
                   </div>
                  </div>
                  <div className="mt-[90px] w-[100%] flex flex-col items-center justify-center" >
                    <div onClick={() => router.push('/create/new')} className="w-[99%] flex items-center justify-center h-14 rounded-lg bg-blue-800/80">
                      <p className="ml-4 text-lg mr-auto">Get Started</p>
                      <ArrowRight className="mr-5 h-6 w-6"/>
                    </div>
                    
                  </div>
                </div>
    </div>
    )
}