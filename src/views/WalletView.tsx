import { MdKeyboardArrowDown } from "react-icons/md";
interface token {
   id: number
  }
  [];
  
  
  interface TeamList extends Array<token> {}
export const WalletView = ( ) => {
    const token1:TeamList =[
        {
            id:3
        }
    ]
    return(
        <div className="w-[100%] py-2 px-1 h-auto bg-red-400/0">
        <>
        <div className="bg-gothic-950/0 mt-0.5 flex  mb-2 flex-col items-center justify-center w-[100%] h-auto">
          <div className="mt-0.5 mb-4 w-full flex">
           <div className="bg-white/15 border border-[#448cff]/45 text-white mt-1 rounded-xl p-1.5 flex ml-auto mr-[45px] w-[51%] h-9">
           <img src='./assets/5426.png' className="mr-1 w-6 h-6 rounded-full"/>
            <div className="mb-0.5">{'SOLANA'}</div>
            <MdKeyboardArrowDown className="text-2xl text-[#448cff]/45 ml-auto mr-1 mb-2" />
           </div>
           <div  className="w-11 p-2 mr-1.5 flex items-center justify-center rounded-full">
             
              <img src="./assets/setting.svg" className="text-white" />
           </div>
          </div>
          <div className="bg-s-gray-300/0 w-[90%] flex flex-col items-center justify-center rounded-3xl h-[120px]">
            <p className="text-[14px] font-light text-[#666666] mb-0.5">Total Balance</p>
            <p className="text-5xl font-bold text-white/85">{`399`}</p>
          </div>
          
        </div>
        <div className="bg-gothic-950/0 mt-3 flex items-center justify-center w-[100%] h-auto">
          <div className="bg-gothic-300/0 w-[90%] flex items-center justify-center rounded-3xl h-[100px]">
            <div
            
              className="text-xl bg-white/10  border-[#448cff]/25 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60"
            >
              <img src="./assets/send.svg" className="mt-1" />
              <p className="text-sm mt-2.5 text-white/50 font-light ">Send</p>
            </div>
            <div
             
              className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60"
            >
              <img src="./assets/receive.svg" className="mt-1" />
              <p className="text-sm mt-2.5 text-white/50 font-light ">
                Receive
              </p>
            </div>
           
          </div>
        </div>
        {/**<div className="bg-gothic-950/0 mt-16 flex items-center justify-center w-[100%] h-auto">
          <div className="bg-gothic-300/5 w-[90%] flex items-center justify-center rounded-3xl h-[100px]">
              <div className="bg-gothic-600/85 w-9 flex items-center justify-center h-9 ml-[40px] mr-[20px] rounded-full">
                  <IoKey className="text-white/90 text-2xl" />
              </div>
              <div className="ml-[10px] mr-auto px-3">
                  <p className="text-sm">BackUp Your Seed Phrases</p>
              </div>
          </div>
  </div> **/}
        <div className="bg-gothic-950/0 mt-8 flex flex-col items-center justify-center w-[100%] h-auto">
          <p className=" ml-7 mr-auto text-[16px] font-light text-[#ddd9d9] mb-1.5">Balances</p>
          <div className="bg-white/10 w-[90%] mb-1.5 flex items-center justify-center rounded-3xl h-[70px]">
            <div className="bg-gothic-600/85 w-12 flex items-center justify-center h-12 ml-[23px] mr-[10px] rounded-full">
              <img
                src={"./assets/5426.png"}
                className="text-white/90 w-full h-full rounded-full text-2xl"
              />
            </div>
            <div className="ml-[5px] text-white/85 mr-auto px-3">
              <p className="text-sm font-bold mb-1">{'Solana'}</p>
              <p className="text-sm">{`2 SOL`}</p>
            </div>
            <div className="ml-[10px]  text-white/85 mr-4 px-3">
              <p className="text-[15px] mb-1">
               {`$${300}`}
              </p>
              <p className="text-[15px] ">
              {`$${60}`}
              </p>
            </div>
          </div>
          {
            token1 && token1.map((token,i) => (
              <>
              <div key={i} className="bg-white/10 w-[90%] mb-0.5 flex items-center justify-center rounded-3xl h-[70px]">
            <div className="bg-gothic-600/85 w-12 flex items-center justify-center h-12 ml-[23px] mr-[10px] rounded-full">
              <img
                src={"./assets/5426.png"}
                className="text-white/90 w-full h-full rounded-full text-2xl"
              />
            </div>
            <div className="ml-[5px] text-white/85 mr-auto px-3">
              <p className="text-sm font-bold mb-1">{'Solana'}</p>
              <p className="text-sm">{`${233} SOL`}</p>
            </div>
            <div className="ml-[10px]  text-white/85 mr-4 px-3">
              <p className="text-[15px] mb-1">
               {`$${30}`}
              </p>
              <p className="text-[15px] ">
              {`$${20}`}
              </p>
            </div>
          </div>
              </>
            ))
          }
        <div 
              
              className={`w-[199px]   ml-1 mr-auto py-1 mb-5 px-3 flex  items-center justify-center bg-black/0 rounded-full h-8`}
            >
              <p className="text-[#448DFC] font-light text-[14px] ml-auto mr-auto ">
                + Add Custom token
              </p>
            </div>
        </div>
        </>
      </div>

    )
}