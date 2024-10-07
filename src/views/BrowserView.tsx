'use client'
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
export const BrowserView = () => {
    const router = useRouter() 
    return( <div className=" w-[100%] h-[100%]">
        <div className=" bg-slate-50/0 mb-[40px] w-[100%] flex py-3 px-2 ">
            <div className="border flex items-center px-2 justify-center ml-auto mr-auto h-12 w-[98%] border-white/45 rounded-lg">
               <input  className="w-[82%] outline-none bg-transparent h-9" />
               <Search className="w-[15%] " />
            </div>
         </div>
         <div className="w-[100%] flex items-center justify-center h-[300px]">
            <img className="w-[80%] h-[80%]" src="/assets/browser.svg" />
         </div>
         <div className="mt-[1px] flex flex-col items-center justify-center">
             <p className="text-xl mb-20 font-light">Coming Soon</p>
             <div onClick={() => router.back()} className="w-[60%] ml-auto mr-auto py-1 border border-[#448cff]/0 rounded-xl bg-white/90 h-12 flex justify-center items-center">
               <p className="text-center text-black">Back Home</p>
             </div>
         </div>
     </div>)
}