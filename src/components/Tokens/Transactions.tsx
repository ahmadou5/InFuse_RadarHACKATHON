import { GetUserTransaction } from "@/lib/solana.lib"
import { Connection, clusterApiUrl,PublicKey } from "@solana/web3.js"
import { useAuth } from "@/context/AuthContext"
import { TransactionDetails } from "@/interfaces/models.interface"
import { useEffect, useState } from "react"
export const Transactions = ({tokenId}:{tokenId: string}) => {
  const [userReceiveTxn, setUserReceiveTxn] = useState<TransactionDetails[]|undefined>([])
  const connection = new Connection(clusterApiUrl('devnet'))
  const [activeTab, setActiveTab] = useState("Sent");
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
              <div>
              {["Sent", "Receive"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-6 rounded-lg ml-0 mr-2 text-sm mb-4 font-medium ${
                activeTab.toLowerCase() === tab.toLowerCase()
                  ? "bg-white/10 bg-opacity-20 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}

            {
              activeTab === 'Sent' ? 
              <>
              {
                userReceiveTxn && userReceiveTxn.map((txn,i) => (
                  <div className="h-20 rounded-2xl w-[99%] mt-1 mb-1 ml-auto mr-auto bg-white/5" key={i}>
                    {txn.amount}
                  </div>
                )) 
              }
              </> 
              : 
              <> 
               {
                userReceiveTxn && userReceiveTxn.map((txn,i) => (
                  <div className="h-20 rounded-2xl w-[99%] mt-1 mb-1 ml-auto mr-auto bg-white/5" key={i}>
                    {txn.amount}
                  </div>
                )) 
              }
              </>
            }
              </div>
              
            </div>
          </div>
          
        </div>
        </div>
)
} 