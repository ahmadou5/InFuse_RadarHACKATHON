'use client'
import { TransactionService } from "@/lib/services/transaction.service"
import { UserService } from "@/lib/services/user.service"
//import { useInitData } from "@telegram-apps/sdk-react"
import { useEffect } from "react"
import { Connection, PublicKey  } from "@solana/web3.js"
import { useAuth } from "@/context/AuthContext"
import { AuthContextProps } from "@/interfaces"
import { GetUserTransaction } from "@/lib/solana.lib"
import { Loading } from "@/components/LoadingScreen"

export const Homeview = () => {
    const address = new PublicKey('3SztGJVq9WFKdENT4ogtAN8dkrF1yDi5uQyPQiQKAKLe')
    const { user:user3 }:AuthContextProps = useAuth()
    const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=e5fc821c-2b64-4d66-9d88-7cf162a5ffc8',{commitment:'confirmed'});
    useEffect(() => {
       const trx2 = GetUserTransaction(connection,address)
       const user = UserService.GetUser();
       console.log(user,user3,'shegen')
       const trx = TransactionService.GetTransactionByAddress('3SztGJVq9WFKdENT4ogtAN8dkrF1yDi5uQyPQiQKAKLe')
       console.log(trx,'ahmadous')
       console.log(trx2,'here')
    },[])
    
    return(
     <div className="min-h-screen">
      <Loading />
     </div>
     )
}