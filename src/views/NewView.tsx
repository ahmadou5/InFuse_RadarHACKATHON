'use client'
import { useInitData } from "@telegram-apps/sdk-react"
import { createSolanaWallet } from "@/lib/solana.lib";
import { UserService } from "@/lib/services/user.service";
import { useState } from "react";

export const NewView = () => {
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

    return(
    <div className="w-[100%]">
         <div className="w-[100%] flex flex-col p-5 h-[100%]">
                  <div className="mt-[100px] mb-[80px] w-[100%] flex flex-col ">
                    <div className="flex items-center justify-center">
                        <p className="text-xl">Create You Wallet</p>
                    </div>
                  </div>
                  <div className="w-[98%] mt-5 h-auto py-4 px-2 bg-red-500 rounded-xl">

                  </div>
                  <div className="mt-20 w-[100%] flex flex-col items-center justify-center" >
                    <div className="w-[99%] flex items-center justify-center h-14 rounded-lg bg-blue-800/80">
                      <p className="ml-4 mr-auto"> Create New</p>
                    </div>
                  </div>
                </div>
    </div>
)
}