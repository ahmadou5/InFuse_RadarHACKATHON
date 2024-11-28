import { getSolanaTransactions } from "@/lib/solana.lib";
//import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useAuth } from "@/context/AuthContext";
//import { TransactionDetails } from "@/interfaces/models.interface";
import { useEffect, useState } from "react";
//import { ENV } from "@/lib/constant/env.constant";
import { ArrowUp01, ArrowDown01 } from "lucide-react";
import { formatAddress } from "@/lib/helper.lib";
import { getSPLTokenTransactions } from "@/lib/spl.lib";

//yimport { Tokens } from "@/interfaces/models.interface";
//import { TokenService } from "@/lib/services/TokenServices";
import { useNetwork } from "@/context/NetworkContext";
import { Token } from "@/utils/tokens.utils";
//import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export interface TransactionData {
  signature: string;
  timestamp: number | null;
  slot: number;
  fee: number;
  amount: {
    lamports: number;
    sol: number;
    formatted: string;
  };
  type: "receive" | "send";
  fromAddress: string;
  toAddress: string;
  status: "success" | "failed";
}

type TransactionDataArray = Array<TransactionData>;
export const Transactions = ({ tokenId }: { tokenId: string }) => {
  const [userReceiveTxn, setUserReceiveTxn] = useState<TransactionDataArray>(
    []
  );
  const [userSentTxn, setUserSentTxn] = useState<TransactionDataArray>([]);
  //const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const [activeTab, setActiveTab] = useState("Received");
  const { user } = useAuth();
  const { network } = useNetwork();
  const getUserTx = async () => {
    try {
      if (tokenId[0] === network.name.toLowerCase()) {
        if (!user) return;
        console.log("what the f");

        const trx = await getSolanaTransactions(user.solPublicKey, {
          limit: 100 | 0,
          cluster: network.rpcUrl,
        });
        setUserSentTxn(trx.filters.sent());
        setUserReceiveTxn(trx.filters.received());
        console.log(trx.transactions);
      } else {
        if (!user) return;
        const response = Token.find((token) => token.token_id === tokenId);
        if (response && Array.isArray(response)) {
          //console.log(response.data[0].address);
          const trx = await getSPLTokenTransactions(user.solPublicKey, {
            limit: 100 | 0,
            cluster: network.rpcUrl,
            mintAddress: response[0]?.address,
          });
          console.log("spl data", trx);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const caller = async () => {
    try {
      //await getTokenInfo(tokenId);
      getUserTx();
    } catch (error) {}
  };
  useEffect(() => {
    caller();
  }, []);
  return (
    <div className="w-[100%]">
      {/* Token Stats */}
      <div className="flex ml-auto mr-auto w-[93%] mt-8 mb-8">
        <div className="bg-white/  bg-opacity-10 ml-auto mr-auto w-[100%] rounded-xl p-2">
          <h3 className="text-lg font-semibold mb-4">Recent Transaction</h3>
          <div className="space-y-2">
            <div>
              {["Received", "Sent"].map((tab) => (
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

              {activeTab === "Received" ? (
                <>
                  {!userReceiveTxn ? (
                    <>
                      <div className="w-[50%] ml-auto mr-auto h-12 flex items-center justify-center">
                        <p>No recent Transaction</p>
                      </div>
                    </>
                  ) : (
                    userReceiveTxn.map((txn, i) => (
                      <div
                        className="h-20 rounded-2xl w-[99%] mt-1 mb-1 ml-auto mr-auto bg-white/5"
                        key={i}
                      >
                        <div className="flex py-2 px-1">
                          <div className="w-[20%] flex text-sm py-2 flex-col items-center justify-center">
                            <ArrowDown01 />
                            <p>{txn?.type}</p>
                          </div>
                          <div className="w-[45%] flex items-center justify-center">
                            <p className="ml-auto mr-auto">
                              {formatAddress(txn?.signature)}
                            </p>
                          </div>
                          <div className="w-[35%] flex text-sm items-center justify-center">
                            {txn.amount.formatted}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              ) : (
                <>
                  {!userSentTxn ? (
                    <>
                      <div className="w-[50%] ml-auto mr-auto h-12 flex items-center justify-center">
                        <p>No recent Transaction</p>
                      </div>
                    </>
                  ) : (
                    userSentTxn &&
                    userSentTxn.map((txn, i) => (
                      <div
                        className="h-20 rounded-2xl w-[99%] mt-1 mb-1 ml-auto mr-auto bg-white/5"
                        key={i}
                      >
                        <div className="flex py-2 px-1">
                          <div className="w-[20%] flex text-sm py-2 flex-col items-center justify-center">
                            <ArrowUp01 />
                            <p>{txn?.type}</p>
                          </div>
                          <div className="w-[45%] flex items-center justify-center">
                            <p className="ml-auto mr-auto">
                              {formatAddress(txn?.signature)}
                            </p>
                          </div>
                          <div className="w-[35%] flex text-sm items-center justify-center">
                            {txn?.amount.formatted}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
