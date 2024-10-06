import { GetUserTransaction } from "@/lib/solana.lib"
import { Connection, clusterApiUrl,PublicKey } from "@solana/web3.js"
import { useAuth } from "@/context/AuthContext"
import { TransactionDetails } from "@/interfaces/models.interface"
import { useEffect, useState } from "react"
export const Transactions = ({tokenId}:{tokenId: string}) => {
  const [userReceiveTxn, setUserReceiveTxn] = useState<TransactionDetails[]|undefined>([])
  const connection = new Connection(clusterApiUrl('devnet'))
  const { user } = useAuth()
    const getUserReceiveTx = async () => {
        try {
          if(tokenId[0] === 'solana') {
            if(!user) return
            console.log('what the f')
            let senderPubKey: PublicKey;
            try {
            senderPubKey = new PublicKey(user.publicKey);
            } catch (error) {
             throw new Error("Invalid sender address");
            }
            const trx = await GetUserTransaction(connection, senderPubKey)
            setUserReceiveTxn(trx)
            console.log(trx)
          } else {
            
          }
          
        } catch (error) {
          console.log(error)
        }
    }
    useEffect(() => {
      getUserReceiveTx()
    },[])
    return(
        <div className="w-[100%]">
        
        {/* Token Stats */}
        <div className="flex ml-auto mr-auto w-[93%] mt-8 mb-8">
          <div className="bg-white/  bg-opacity-10 ml-auto mr-auto w-[100%] rounded-xl p-2">
            <h3 className="text-lg font-semibold mb-4">Recent Transaction</h3>
            <div className="space-y-2">
              {
                userReceiveTxn && userReceiveTxn.map((txn,i) => (
                  <div className="h-12 w-[120px] bg-slate-200" key={i}>
                    {txn.amount}
                  </div>
                )) 
              }
            </div>
          </div>
          
        </div>
        </div>
)
} 