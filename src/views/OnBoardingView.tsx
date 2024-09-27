'use client'
//import { SolanaWalletInfo } from "@/lib/solana.lib"
import { useRouter } from "next/navigation"
import { UserService } from "@/lib/services/user.service"
import { useState } from "react"
import { useInitData } from "@telegram-apps/sdk-react"
import { createSolanaWallet } from "@/lib/solana.lib"
//import Image from "next/image"
import { ArrowRight, CircleGauge, ShieldCheck } from "lucide-react"
export const OnboardView = () => {
    const [isNew,setIsNew] = useState<boolean>(false)
    const [name,setName] = useState<string>('')
    const [email,setEmail] = useState<string>('')
    const [pin,setPin] = useState<number>(0)
    const [id,setId] = useState<number>(0)
    const tgData = useInitData()
    const handleSubmit = async () => {
        console.log(name,pin,email,id)
        if (tgData?.user?.id === undefined) {
            console.log('User ID is undefined');
            return;
          }
        const walletInfo = await createSolanaWallet()
        const upload = UserService.CreateUser({
            user_id:tgData.user.id,
            email:email,
            username: name,
            pin: pin,
            privateKey:walletInfo?.secret,
            publicKey:walletInfo?.publicKey,
            mnemonic:walletInfo?.mnemonic,

        })
        console.log(upload,'created')
        
    }
    const router = useRouter()
    return(
    <div className="w-[100%]">
        {
                isNew ? 
                <>
        <div className="w-[70%] py-12 px-12 flex p-10 items-center justify-center h-[100px] bg-black">
            <input onChange={(e:React.ChangeEvent<HTMLInputElement>) => setName(e.target?.value)} placeholder="username" className="mt-6 ml-auto mr-auto" type="text" />
            <input onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target?.value)} placeholder="mail"  className="mt-6 ml-auto mr-auto" type="text" />
            <input onChange={(e:React.ChangeEvent<HTMLInputElement>) => setId(e.target?.valueAsNumber)} placeholder="id"  className="mt-6 ml-auto mr-auto"  type="number" />
            <input onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPin(e.target?.valueAsNumber)} placeholder="pin" className="mt-6 ml-auto mr-auto"  type="number" />
       </div>
       <button onClick={() => { 
        setIsNew(true)
        handleSubmit()
        }}>
        submit
       </button>
                </>
                 : 
                <div className="w-[100%] flex flex-col p-5 h-[100%]">
                  <div className="mt-[98px] w-[100%] flex flex-col items-start justify-start">
                    <div className="text-[25px] ml-auto mr-3 font-light w-[100%]">
                        Welcome
                        to
                        <p className="text-blue-800 text-4xl font-light">InFuse Wallet</p>
                        
                    </div>
                   <div className="flex w-[100%] mt-10 py-2 px-4 h-[117px]  bg-white/5 bg-opacity-2 rounded-xl">
                      <div  className="h-[100%] flex items-center justify-center w-[30%]">
                        <CircleGauge className="text-blue-800/55 w-14 h-14" />
                      </div>
                      <div  className="h-[100%] flex flex-col items-start justify-center px-4">
                       <p className="text-white text-lg mb-1">Fast and Cheap</p>
                        <p className="text-white/65">stuffsa that tells about how easily you can get onboareded</p>
                      </div>
                   </div>
                   <div className="flex w-[100%] py-2 px-4 mt-5 h-[117px] bg-white/5 bg-opacity-2 rounded-xl">
                   <div  className="h-[100%] flex  items-center justify-center w-[30%]">
                        <ShieldCheck className="text-blue-800/55 w-14 h-14" />
                      </div>
                      <div  className="h-[100%] flex flex-col items-start justify-center px-4">
                       <p className="text-white text-lg mb-1">Secured</p>
                        <p className="text-white/65">stuffsa that tells about how easily you can get onboareded</p>
                      </div>
                   </div>
                  </div>
                  <div className="mt-[90px] w-[100%] flex flex-col items-center justify-center" >
                    <div onClick={() => router.replace('/create/new')} className="w-[99%] flex items-center justify-center h-14 rounded-lg bg-blue-800/80">
                      <p className="ml-4 text-lg mr-auto"> Create New</p>
                      <ArrowRight className="mr-5 h-6 w-6"/>
                    </div>
                    
                  </div>
                </div>
        }
    </div>
    )
}