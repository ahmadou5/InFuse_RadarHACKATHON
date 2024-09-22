export const SettingView = () => {
    return(<div className="bg-gothic-950/0 mt-1 flex bg-slate-600/0  mb-2 flex-col items-center justify-center w-[100%] h-auto">
        <div className="w-[40%] mt-4 ml-auto mr-auto flex items-center justify-center bg-black/25 h-9 rounded-3xl ">
          <p className="text-white text-[16px] font-bold">Settings</p>
        </div>
        <div className="w-[96%] mt-2 py-2 px-2 h-auto mb-20 rounded-md bg-black/0">
        <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
          
          <div  className="bg-white/0 border-b-black/5 border-t-black/5 border border-white/0 w-[99%] flex items-center justify-center rounded-sm h-[70px]">
            <div className="ml-[5px]   text-white  mr-auto px-3">
              <p className="text-[19] font-bold mb-1.5">Show Recovery Phrases</p>
            </div>
          </div>  
          <div className="bg-white/0 border-b-black/5 border-t-black/5 border border-white/0 w-[99%] flex items-center justify-center rounded-sm h-[70px]">
            <div className="ml-[5px]   text-white  mr-auto px-3">
              <p className="text-[19] font-bold mb-1.5">Show Private Key</p>
            </div>
          </div>  
            
        </div>
          
        </div>
      </div>
      )
}