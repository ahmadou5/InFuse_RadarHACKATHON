'use client'
import { ArrowLeft, ChevronRight  } from "lucide-react"
import { useRouter } from "next/navigation"
export const SettingView = () => {

    const router = useRouter()
    return(<div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0 py-2 text-white/70 mb-2 flex-col items-center justify-center w-[100%] h-auto">
      <div className=" bg-slate-50/0 mb-[20px] w-[100%] px-2 flex  ">
             <div onClick={() => router.back()}  className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10">
             <ArrowLeft  className="font-bold text-xl"/>
             </div>
             <div className="ml-auto mt-1.5 mr-[45%]">
               <p className="text-white text-[16px] font-bold">Settings</p>
             </div>
            
            </div>
      
        <div className="w-[98%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
        <div className="w-[97%] h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
          <div className='w-[100%] py-4 px-5 flex'>
            <p className="text-[18px] ">Account</p>
            <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
          </div>
      
        </div>
        <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
          <div className='w-[100%] py-4 px-5 flex'>
            <p className="text-[18px] ">Active Networks</p>
            <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
          </div>
          <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
          <div className='w-[100%] py-4 px-5 flex'>
            <p className="text-[18px] ">Connected Apps</p>
            <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
          </div>
      
        </div>
        <div className="w-[97%] mt-4 h-[60px] rounded-xl bg-slate-500/15 ml-auto mr-auto">
          <div className='w-[100%] py-4 px-5 flex'>
            <p className="text-[18px] ">Developers Options</p>
            <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
          </div>
      
        </div>
        <div className="w-[97%] h-[130px] mt-4 rounded-xl bg-slate-500/15 ml-auto mr-auto">
          <div className='w-[100%] py-4 px-5 flex'>
            <p className="text-[18px] ">Community</p>
            <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
          </div>
          <div className="h-0.5 w-[91%] mt-0.5 mb-0.5 ml-auto mr-auto bg-white/20"></div>
          <div className='w-[100%] py-4 px-5 flex'>
            <p className="text-[18px] ">About</p>
            <ChevronRight className="text-xl ml-auto mr-2 mt-0.5" />
          </div>
      
        </div>
        <div className="flex flex-col mt-20 items-center justify-center">
          <img src="/assets/show.png" className="h-12 w-12" />
          <p className="text-[21px] text-white/95 font-semibold">InFuse Wallet</p>
          <p>version 1.8.8</p>
        </div>
        </div>
      </div>
      )
}