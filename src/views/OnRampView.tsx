import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export const RampView = () => {
    const router = useRouter()
    return(
        <div className="mt-3 px-0.5 py-1.5 bg-red-600/0 h-[85%] flex flex-col rounded-xl w-[100%] ml-auto mr-auto">
        <div className="w-[100%] bg-white/0 px-2 flex flex-col border border-[#448cff]/0 justify-center items-center rounded-xl h-[370px]">
      <div className="w-[100%] py-0 px-0 h-[40%] bg-black/0">
      <div className=" bg-slate-50/0 mb-[5px] w-[100%] flex  ">
              <div onClick={() => router.back()} className="bg-white/5 flex items-center justify-center w-12 rounded-xl ml-1 mr-auto h-9">
              <ArrowLeft  className="font-bold text-xl"/>
              </div>
              <div className="ml-auto mt-0.5 mr-auto">
                <p className="font-light text-xl">Send</p>
              </div>
              <div className=" mr-3 ml-auto h-[100%] bg-slate-400/0"  >
             <img src="/assets/scanner.svg" className="h-7  w-7 mt-0" />
            </div>
             </div>
       
       
      </div>
     
    </div>
        
      </div>
)
}