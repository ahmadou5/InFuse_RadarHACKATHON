'use client'
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react"
import {  useQRScanner } from "@telegram-apps/sdk-react";
import {sendNativeSol}  from "@/lib/solana.lib";
import { formatAddress } from "@/lib/helper.lib";
import { SpinningCircles } from "react-loading-icons";
import { PublicKey} from "@solana/web3.js";
//import { useAuth } from "@/context/AuthContext";


export const SendView = ({slug}: {slug:string}) => {
    const [loading,setIsLoading] = useState<boolean>(false)
    const [preview,setPreview] = useState<boolean>(false)
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [isAddressChecked,setIsAddressChecked] = useState<boolean>(false)
    const [amount,setAmount] = useState<number>(0)
    //const connection = new Connection(clusterApiUrl('devnet'))
    //const router = useRouter()
    //const { user } = useAuth()
    const scanner = useQRScanner()
    const  handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      setReceiveAddress(event.target.value)
    }
    
    console.log(slug)
    const router = useRouter()
    const scan = () => {
      try {
        //alert('startes')
        scanner.open('Scan QR code').then((content) => {
          if(!content) {
            return
          }
          //alert('in d middle')
          console.log(content);
          //setReceiveAddress(content)
          setReceiveAddress(content)
        });
        console.log(scanner.isOpened); // true
      } catch (error) {
        console.log(error)
      }
    }
    const handleTransfer = async () => {
      try {
        if(slug[0] === 'solana') {
          console.log('send it',slug)
          sendNativeSol({
            amount:amount,
            fromPubkey: new PublicKey(receiveAddress),
            toPubkey: new PublicKey(receiveAddress)
          })
          setIsLoading(true)
        }
        alert(slug)
      } catch (error) {
        console.log(error)
      }
    }
    return(
    
    <>
    {
      isAddressChecked ? 
      <>
      <div className=" py-4 px-2 bg-red-600/0 max-h-screen flex flex-col rounded-xl w-[99%] ml-auto mr-auto">
      <div className=" bg-slate-50/0 mb-[5px] w-[100%] flex  ">
             <div onClick={() => setIsAddressChecked(false)} className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10">
             <ArrowLeft  className="font-bold text-xl"/>
             </div>
             <div className="ml-auto mt-0.5 mr-[45%]">
               <p className="font-light text-xl">Send</p>
             </div>
            
            </div>
            <div className="w-[100%] h-12 bg-slate-50/0 rounded-xl py-3 px-6">
              <p className="text-[19px] text-white font-light">{`Address to : ${formatAddress(receiveAddress)
                }`}</p>
            </div>
            <div className="w-[98%] mt-4 ml-auto mr-auto h-[430px] py-3 px-2 flex flex-col items-center justify-center border border-[#448cff]/60 rounded-2xl bg-black/40">
              <div className="w-[100%] ml-auto mr-auto text-white rounded-xl  flex  h-16">
              
                <input
                  type="number"
                  id="pin"
                  name="pin"
                  value={amount}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.valueAsNumber) }
                  placeholder="0"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  security='yes'
                  maxLength={8}
                  
                  className="outline-none bg-transparent text-end text-3xl ml- w-[50%] h-[100%] "
                
                />
                <p className="mt-5 text-xl font-light ml-1 mr-auto">SOL</p>
              </div>
              <div className="bg-black/0 rounded-2xl w-[150px] border border-white h-9">
                <p className="text-white text-center py-1.5">
                  
                </p>
              </div>
            </div>
            <div>
              <div className="h-12 w-[100%] flex items-center justify-between py-1 px-2 bg-red-500/0 mt-8">
                <div
                  //onClick={() => setAmount(ethBalance.toString().slice(0, 6))}
                  className="bg-white/20 rounded-2xl w-20 h-9"
                >
                  <p className="text-white text-center py-1.5">MAX</p>
                </div>
                <div className="text-s-gray-950">
                  <p>{`Available: ${0} SOL`}</p>
                </div>
              </div>
              <div className="mt-10 w-[100%] ml-auto mr-auto">
                <div className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/90 h-14">
                  <button
                    onClick={() => {
                      if (receiveAddress !== "") {
                        //setPreview(true);
                        handleTransfer()
                      }
                    }}
                    className="outline-none bg-transparent w-[100%] h-[100%] text-white  py-2 px-4"
                  >
                    {/** {" "} ${ethBalance.toString().slice(0, 5)}
                    {loading ? (
                      <SpinningCircles className="ml-auto mr-auto h-7 w-7" />
                    ) : (
                      "Confirm"
                    )}*/}
                    confirm
                  </button>
                </div>
              </div>
              {preview && (
                <>
                <div className="inset-0 fixed bg-black/95 bg-opacity-100 w-[100%] z-[99999999] min-h-screen h-auto backdrop-blur-sm flex ">
        <div className="w-[100%] flex items-center px-3 justify-center">
            <div className="h-[416px] ml-auto mr-auto py-2 px-2 w-[352px] bg-white/15 rounded-xl">
            
            <div className="mt-5 ml-auto mr-auto flex flex-col items-center justify-center text-center">
                <p className="text-center text-[#DEEAFC]  font-light text-[18px] mb-3">{`Transaction Details`} </p>
                <div className="flex items-center justify-center">
                  <img src="./assets/sol.png" className="w-[42px] h-[42px]" />
                </div>
                <div className="w-[90%]  ml-auto mr-auto py-1 px-3 flex  items-center justify-center bg-white/0 rounded-full h-9">
                  <p className="text-white/85 font-bold text-[32px] ml-auto mr-auto ">{`${amount} SOL`}</p>
                </div>
                <div className="w-[90%]  ml-auto mr-auto py-1 px-3 flex  items-center justify-center bg-white/0 rounded-full h-9">
                  <p className="text-[#666666] font-bold text-[14px] ml-auto mr-auto ">{`$${(6)}`}</p>
                </div>
                
                <div className="w-[303px]  ml-auto mr-auto py-1 px-3 flex flex-col items-center justify-center bg-white/0 rounded-sm mt-1 mb-3 h-[163px]">
                  <div className="w-[100%] mt-1 mb-1 bg-black/15 h-10 py-2 px-2 rounded-2xl flex">
                    <div className="ml-2 mr-auto">To</div>
                    <div className="ml-auto mr-2">{(receiveAddress)}</div>
                  </div>
                  <div className="w-[100%] mt-1 mb-1 bg-black/15 h-10 py-2 px-2 rounded-2xl flex">
                    <div className="ml-2 mr-auto">Network</div>
                    <div className="ml-auto mr-2">Solana</div>
                  </div>
                  <div className="w-[100%] mt-1 mb-1 bg-black/15 h-10 py-2 px-2 rounded-2xl flex">
                    <div className="ml-2 mr-auto">Fee</div>
                    <div className="ml-auto mr-2">0.0003</div>
                  </div>
                  <div className="w-[100%] bg-white h-0.5/2"></div>
                </div>
                <div className="flex w-[100%]">
                <div onClick={() => {
                    //setIsSend(false)
                     setPreview(false)
                    }} className="w-[105px] mt-1  ml-auto mr-auto py-1 px-3 flex  items-center border border-[#448cff]/60  justify-center text-white bg-black/90 rounded-full h-9">
                  <p>Cancel</p>
                </div>
               
                <div className="w-[105px] mt-1  ml-auto mr-auto py-1 px-3 flex  items-center border border-[#448cff]/60  justify-center text-white bg-black/90 rounded-full h-9">
                  <button
                    onClick={() => {
                      if (receiveAddress !== "") {
                        //handleSendSol();
                        //setIsTxSuccess(true)
                        console.log('uiss')
                      }
                    }}
                    className="outline-none bg-transparent w-[100%] h-[100%] text-white  py-0 px-4"
                  >
                    {" "}
                    {loading ? (
                      <SpinningCircles className="ml-auto mr-auto h-5 w-5" />
                    ) : (
                      "Sign"
                    )}  
                    
                  </button>
                </div>
                </div>
               
            </div>
            </div>
        </div>
        </div>
                </>
                )}
             {/** {isTxSuccess && (
                <TransactionSuccessModal hash={comment} amount={amount} />
              )}
              {isTxFail && <FailedTxModal message={failedcomment} />}**/}
            </div>
          </div>
      </>
       : 
       <div className="mt-3 px-0.5 py-1.5 bg-red-600/0 h-[85%] flex flex-col rounded-xl w-[100%] ml-auto mr-auto">
       <div className="w-[100%] bg-white/0 px-2 flex flex-col border border-[#448cff]/0 justify-center items-center rounded-xl h-[370px]">
     <div className="w-[100%] py-0 px-0 h-[40%] bg-black/0">
     <div className=" bg-slate-50/0 mb-[5px] mt-1 w-[100%] flex  ">
             <div onClick={() => router.back()}  className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10">
               <X  className="font-bold text-xl"/>
             </div>
             <div className="ml-auto mt-1 mr-[145px]">
               <p className="font-light text-xl">Receipient</p>
             </div>
             
            </div>
       <div className="flex mt-[30px]">
       <p className="mb-3 mt-2 mr-auto text-[16px] ml-3"></p>
       <div className="mr-4 mt-8">
         {
           receiveAddress?.length > 42 &&
           <>
           <img src="https://solana-wallet-orcin.vercel.app/assets/good.svg" />
           </> 
          
         }
       </div>
       </div>
       <div className={`w-[100%] ml-auto mr-auto ${receiveAddress.length > 0 && receiveAddress.length < 42 ? ' border-red-500 border' : 'border-none'} h-16 py-2 px-1 flex rounded-2xl bg-[#1F1F1F]`}>
              
              <div className="w-[99%] py-1.5 flex items-center justify-center bg-slate-50/0">
                <input
                  className={`w-[90%] h-[90%] ml-3 mr-auto text-[18px] bg-transparent outline-none`}
                  onChange={handleChange}
                  type="text"
                  placeholder="Address"
                  value={receiveAddress}
                />
                 <div className=" mr-3 ml-2 h-[100%] bg-slate-400/0" onClick={() => scan() } >
            <img src="/assets/scanner.svg" className="h-7  w-7 mt-0" />
           </div>
              </div>
            </div>
       <div>
         {receiveAddress.length > 0 && receiveAddress.length < 42 ? 
         <>
         <p className="text-[#FC4444] text-[14px]">Invalid address</p>
         </>
          : 
         <></>  }
       </div>
     </div>
     <div className="w-[99%] flex flex-col py-2 px-1 h-[60%] bg-black/0">
     
       <div className="mt-[360px] w-[98%] ml-auto mr-auto">
        <button onClick={() => {
           if(receiveAddress.length >= 40 ) {
             setIsAddressChecked(true)
           }
         }}  className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/90 h-14">
           Continue
         </button> 
       </div>
     </div>
   </div>
       
     </div>
    }
    </>
)
}