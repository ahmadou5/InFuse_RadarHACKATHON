'use client'
import { UserService } from "@/lib/services/user.service"
import { useState } from "react"
import { useInitData } from "@telegram-apps/sdk-react"
export const OnboardView = () => {
    const [name,setName] = useState<string>('')
    const [email,setEmail] = useState<string>('')
    const [pin,setPin] = useState<number>(0)
    const [id,setId] = useState<number>(0)
    const tgData = useInitData()
    const handleSubmit = () => {
        console.log(name,pin,email,id)
        if (tgData?.user?.id === undefined) {
            console.log('User ID is undefined');
            return;
          }
        const upload = UserService.CreateUser({
            user_id:tgData.user.id,
            email:email,
            username: name,
            pin: pin
        })
        console.log(upload,'created')
        
    }
    return(
    <div className="">
       <div className="w-[70%] py-12 px-12 flex p-10 items-center justify-center h-[100px] bg-black">
            <input onChange={(e:React.ChangeEvent<HTMLInputElement>) => setName(e.target?.value)} placeholder="username" className="mt-6 ml-auto mr-auto" type="text" />
            <input onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target?.value)} placeholder="mail"  className="mt-6 ml-auto mr-auto" type="text" />
            <input onChange={(e:React.ChangeEvent<HTMLInputElement>) => setId(e.target?.valueAsNumber)} placeholder="id"  className="mt-6 ml-auto mr-auto"  type="number" />
            <input onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPin(e.target?.valueAsNumber)} placeholder="pin" className="mt-6 ml-auto mr-auto"  type="number" />
       </div>
       <button onClick={() => handleSubmit()}>
        submit
       </button>
    </div>
    )
}