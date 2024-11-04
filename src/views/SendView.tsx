"use client";
import { ArrowLeft, X } from "lucide-react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQRScanner } from "@telegram-apps/sdk-react";
import { getSplTokenBalance, handleSendSol } from "@/lib/solana.lib";
import { formatAddress, getSolPrice } from "@/lib/helper.lib";
import { SpinningCircles } from "react-loading-icons";
//import { PublicKey} from "@solana/web3.js";
import { SolConverter } from "@/lib/helper.lib";
import { SendSplToken } from "@/lib/spl.lib";
import Link from "next/link";
import { getTokenPrice } from "@/lib/helper.lib";
//import { fetchSolPriceB } from "@/lib/solana.lib";
import { useAuth } from "@/context/AuthContext";
import { TokenService } from "@/lib/services/TokenServices";
import { Tokens } from "@/interfaces/models.interface";
import { useNetwork } from "@/context/NetworkContext";
export const SendView = ({ slug }: { slug: string }) => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [isTxSuccess, setIsTxSuccess] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const [receiveAddress, setReceiveAddress] = useState<string>("");
  const [isAddressChecked, setIsAddressChecked] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [solFee, setSolFee] = useState<number | undefined>(0);
  const [hash, setHash] = useState<string | undefined>("");
  const amountRef = useRef<HTMLInputElement>(null);

  const { network } = useNetwork();
  const { user } = useAuth();
  const scanner = useQRScanner();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiveAddress(event.target.value);
  };

  const connection = new Connection(
    network?.rpcUrl || clusterApiUrl("devnet"),
    {
      commitment: "confirmed",
    }
  );

  const getTokenInfo = async (slug: string) => {
    try {
      // setIsLoading(true);
      // console.log('Fetching token info for slug:', slug);
      const response = await TokenService.getTokenBytoken_id(slug);
      //console.log('Token info response:', response);

      if (response?.data && Array.isArray(response.data)) {
        setTokenInfo(response.data);
        console.log("Token info set:", response.data);
        return response.data;
      } else {
        console.error("Invalid token data received:", response);
        setTokenInfo([]);
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      setTokenInfo([]);
    } finally {
      //    setIsLoading(false);
      //alert('done')
    }
  };

  const fetchPrice = async (token: string) => {
    try {
      if (token[0] === "solana") {
        const price = await getSolPrice(token[0]);
        console.log(price);
      } else {
        const price = await getTokenPrice(token[0]);
        console.log(price);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchBalances = async (address: string) => {
    try {
      //console.log('gettin bal')
      console.log(tokenInfo[0], "shineee");
      if (slug[0] === "solana") {
        if (!user) return;
        let userPubKey: PublicKey;
        try {
          userPubKey = new PublicKey(user.publicKey);
        } catch (error) {
          throw new Error("Invalid sender address");
        }

        const balance = await connection.getBalance(userPubKey);
        setUserBalance(balance);
        //console.log(balance,'hhhhh');
      } else {
        //console.log('spl ne waannan',address,)
        if (!user) return;
        const balance = await getSplTokenBalance(
          connection,
          address,
          user.publicKey
        );
        console.log(balance);

        setUserBalance(balance);
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
    }
  };

  const fetch = async () => {
    try {
      const tokenDetails = await getTokenInfo(slug);
      if (!tokenDetails) return;
      const balance = fetchBalances(tokenDetails[0]?.address);
      const price = fetchPrice(slug);
      console.log(balance, "ewewewewe", price, "price");
    } catch (error) {
      console.log(error);
    }
  };
  const router = useRouter();
  const scan = () => {
    try {
      //alert('startes')
      scanner.open("Scan QR code").then((content) => {
        if (!content) {
          return;
        }
        //alert('in d middle')
        alert(content);
        //setReceiveAddress(content)
        setReceiveAddress(content);
      });
      console.log(scanner.isOpened); // true
    } catch (error) {
      console.log(error);
    }
  };

  const handleTransfer = async () => {
    try {
      if (slug[0] === "solana") {
        if (!user) {
          return;
        }
        setIsLoading(true);
        // const userAdd = user.publicKey
        // Ensure the private key is properly handled
        const mnemonic = user.mnemonic;
        //const receiver = new PublicKey(receiveAddress)
        // Ensure the receive address is a valid public key
        //const toPubkey = new PublicKey(receiveAddress);
        console.log(mnemonic);
        //console.log(receiver);
        console.log("Sending transaction...", receiveAddress);

        console.log("Sending transaction...");
        const trx = await handleSendSol({
          connection: connection,
          receiveAddress: receiveAddress,
          userMnemonic: mnemonic,
          amount: amount,
        });
        console.log("Transaction result:", trx?.txid);
        console.log(trx?.feeInSol, "fee");
        setSolFee(trx?.feeInSol);
        setHash(trx?.txid);
        setIsLoading(true);
      } else {
        if (!user) return;
        let mintPubKey: PublicKey;
        try {
          mintPubKey = new PublicKey(tokenInfo[0]?.address);
        } catch (error) {
          throw new Error("Invalid mint address");
        }
        let senderPubKey: PublicKey;
        try {
          senderPubKey = new PublicKey(user.publicKey);
        } catch (error) {
          throw new Error("Invalid sender address");
        }
        let receivePubKey: PublicKey;
        try {
          receivePubKey = new PublicKey(receiveAddress);
        } catch (error) {
          throw new Error("Invalid receive address");
        }
        setIsLoading(true);
        const trx = await SendSplToken(connection, {
          amount: amount,
          mnemonic: user?.mnemonic,
          fromPubKey: senderPubKey,
          toPubKey: receivePubKey,
          mintAddress: mintPubKey,
        });
        console.log(trx, "transaction");
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      {isAddressChecked ? (
        <>
          <div className=" py-3 px-2 bg-red-600/0 max-h-screen flex flex-col rounded-xl w-[99%] ml-auto mr-auto">
            <div className=" bg-slate-50/0 mb-[5px] w-[100%] flex  ">
              <div
                onClick={() => setIsAddressChecked(false)}
                className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
              >
                <ArrowLeft className="font-bold text-xl" />
              </div>
              <div className="ml-auto mt-0.5 mr-[45%]">
                <p className="font-light text-xl">Send</p>
              </div>
            </div>
            <div className="w-[100%] h-12 bg-slate-50/0 rounded-xl py-3 px-6">
              <p className="text-[19px] text-white font-light">{`Address to : ${formatAddress(
                receiveAddress
              )}`}</p>
            </div>
            <div className="w-[98%] mt-4 ml-auto mr-auto h-[430px] py-3 px-2 flex flex-col items-center justify-center border border-[#448cff]/60 rounded-2xl bg-black/40">
              <div className="w-[100%] ml-auto mr-auto text-white rounded-xl  flex  h-16">
                <input
                  ref={amountRef}
                  type="number"
                  id="pin"
                  name="pin"
                  //value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAmount(e.target.valueAsNumber)
                  }
                  placeholder="0"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  security="yes"
                  maxLength={8}
                  className="outline-none bg-transparent text-end text-3xl ml- w-[50%] h-[100%] "
                />
                <p className="mt-5 text-xl font-light ml-1 mr-auto">
                  {slug[0] === "solana" ? "SOL" : tokenInfo[0]?.ticker}
                </p>
              </div>
              <div className="bg-black/0 rounded-2xl w-[150px] border border-white h-9">
                <p className="text-white text-center py-1.5">
                  {`$${
                    slug[0] === "solana"
                      ? (amount || 0) * 170
                      : (amount || 0) * 2
                  }`}
                </p>
              </div>
            </div>
            <div>
              <div className="h-12 w-[100%] flex items-center justify-between py-1 px-2 bg-red-500/0 mt-8">
                <div
                  onClick={() => {
                    if (!userBalance) return;
                    setAmount(userBalance);
                    if (amountRef.current)
                      amountRef.current.valueAsNumber = userBalance;
                  }}
                  className="bg-white/20 rounded-2xl w-20 h-9"
                >
                  <p className="text-white text-center py-1.5">MAX</p>
                </div>
                <div className="text-s-gray-950">
                  <p>{`Available: ${
                    slug[0] === "solana"
                      ? SolConverter(userBalance)
                      : userBalance
                  } ${slug[0] === "solana" ? "SOL" : tokenInfo[0]?.ticker}`}</p>
                </div>
              </div>
              <div className="mt-10 w-[100%] ml-auto mr-auto">
                <div className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/90 h-14">
                  <button
                    onClick={() => {
                      if (receiveAddress !== "") {
                        setPreview(true);
                        //handleTransfer()
                      }
                    }}
                    className="outline-none bg-transparent w-[100%] h-[100%] text-white  py-2 px-4"
                  >
                    {" "}
                    Confirm
                  </button>
                </div>
              </div>
              {preview && (
                <>
                  <div className="inset-0 fixed bg-black/95 bg-opacity-100 w-[100%] z-[99999999] min-h-screen h-auto backdrop-blur-sm flex ">
                    <div className="w-[100%] flex items-center px-3 justify-center">
                      <div className="h-[436px] ml-auto mr-auto py-2 px-2 w-[352px] bg-white/15 rounded-xl">
                        <div className="mt-5 ml-auto mr-auto flex flex-col items-center justify-center text-center">
                          <p className="text-center text-[#DEEAFC]  font-light text-[18px] mb-3">
                            {`Transaction Details`}{" "}
                          </p>
                          <div className="flex mb-2 items-center justify-center">
                            <img
                              src={
                                slug[0] === "solana"
                                  ? "/assets/sol.png"
                                  : `${tokenInfo[0]?.logoUrl}`
                              }
                              className="w-[47px] h-[47px]"
                            />
                          </div>
                          <div className="w-[90%]  ml-auto mr-auto py-1 px-3 flex  items-center justify-center bg-white/0 rounded-full h-9">
                            <p className="text-white/85 font-bold text-[32px] ml-auto mr-auto ">{`${amount} ${
                              slug[0] === "solana"
                                ? "SOL"
                                : `${tokenInfo[0]?.name}`
                            }`}</p>
                          </div>
                          <div className="w-[90%]  ml-auto mr-auto py-1 px-3 flex  items-center justify-center bg-white/0 rounded-full h-9">
                            <p className="text-[#666666] font-bold text-[14px] ml-auto mr-auto ">{`$${6}`}</p>
                          </div>

                          <div className="w-[303px]  ml-auto mr-auto py-1 px-3 flex flex-col items-center justify-center bg-white/0 rounded-sm mt-1 mb-3 h-[163px]">
                            <div className="w-[100%] mt-1 mb-1 bg-black/15 h-10 py-2 px-2 rounded-2xl flex">
                              <div className="ml-2 mr-auto">To</div>
                              <div className="ml-auto mr-2">
                                {formatAddress(receiveAddress)}
                              </div>
                            </div>
                            <div className="w-[100%] mt-1 mb-1 bg-black/15 h-10 py-2 px-2 rounded-2xl flex">
                              <div className="ml-2 mr-auto">Network</div>
                              <div className="ml-auto mr-2">Solana</div>
                            </div>
                            <div className="w-[100%] mt-1 mb-1 bg-black/15 h-10 py-2 px-2 rounded-2xl flex">
                              <div className="ml-2 mr-auto">Fee</div>
                              {solFee === 0 ? (
                                <div className="bg-white/20 h-4 w-16 mb-1 mt-2 animate-pulse rounded"></div>
                              ) : (
                                `${solFee}`
                              )}
                            </div>
                            <div className="w-[100%] bg-white h-0.5/2"></div>
                          </div>
                          <div className="flex w-[100%]">
                            <div
                              onClick={() => {
                                //setIsSend(false)
                                setPreview(false);
                              }}
                              className="w-[105px] mt-1  ml-auto mr-auto py-1 px-3 flex  items-center border border-[#448cff]/60  justify-center text-white bg-black/90 rounded-full h-9"
                            >
                              <p>Cancel</p>
                            </div>

                            <div className="w-[105px] mt-1  ml-auto mr-auto py-1 px-3 flex  items-center border border-[#448cff]/60  justify-center text-white bg-black/90 rounded-full h-9">
                              <button
                                onClick={async () => {
                                  if (receiveAddress !== "") {
                                    await handleTransfer();
                                    setIsTxSuccess(true);
                                    console.log("uiss");
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
              {isTxSuccess && (
                <div className="inset-0 fixed bg-black/95 bg-opacity-100 w-[100%] z-[99999999] min-h-screen h-auto backdrop-blur-sm flex ">
                  <div className="w-[100%] flex items-center px-3 justify-center">
                    <div className="h-[100%] mt-[200px] ml-auto mr-auto py-2 px-2 w-[90%] bg-white/0 rounded-xl">
                      <div className="mt-0 ml-auto mr-auto flex flex-col items-center justify-center text-center">
                        <div className="w-[200px] mb-5 h-[200px] flex items-center justify-center">
                          <img
                            src="/assets/good.svg"
                            className="w-[80%] h-[80%]"
                          />
                        </div>
                        <div className="w-[100%]  ml-auto mr-auto py-1 px-3 flex  items-center justify-center bg-white/0 rounded-full h-9">
                          <p className="text-white/85 font-light text-[24px] ml-auto mr-auto ">{`Transaction successfull`}</p>
                        </div>
                        <div className="w-[100%]  ml-auto mr-auto py-1 px-3 flex  mt-12 items-center justify-center bg-white/0 rounded-full h-9">
                          {hash != "" ? (
                            <div className="text-white/85 flex font-light ml-auto mr-auto ">
                              <Link
                                href={`https://${"solscan./io"}/tx/${hash}?cluster=devnet`}
                                target="_blank"
                              >
                                <p className="text-[#448DFC] font-light ml-auto mr-auto ">{`View on Explorer`}</p>
                              </Link>
                            </div>
                          ) : (
                            <div>
                              <p></p>
                            </div>
                          )}
                        </div>
                        <div
                          onClick={() => router.push("/wallet")}
                          className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/50 h-14 flex items-center"
                        >
                          <p className="ml-auto mr-auto">Continue</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/**    {isTxFail && <FailedTxModal message={failedcomment} />}**/}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-3 px-0.5 py-1 bg-red-600/0 h-[85%] flex flex-col rounded-xl w-[100%] ml-auto mr-auto">
          <div className="w-[100%] bg-white/0 px-2 flex flex-col border border-[#448cff]/0 justify-center items-center rounded-xl h-[370px]">
            <div className="w-[100%] py-0 px-0 h-[40%] bg-black/0">
              <div className=" bg-slate-50/0 mb-[5px] w-[100%] flex  ">
                <div
                  onClick={() => router.back()}
                  className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
                >
                  <X className="font-bold text-xl" />
                </div>
                <div className="ml-auto mt-1 mr-[145px]">
                  <p className="font-light text-xl">Receipient</p>
                </div>
              </div>
              <div className="flex mt-[10px]">
                <p className="mb-3 mt-0 mr-auto text-[16px] ml-3"></p>
                <div className="mr-4 mt-8 h-8">
                  {receiveAddress?.length > 42 && (
                    <>
                      <img src="https://solana-wallet-orcin.vercel.app/assets/good.svg" />
                    </>
                  )}
                </div>
              </div>
              <div
                className={`w-[100%] ml-auto mr-auto ${
                  receiveAddress.length > 0 && receiveAddress.length < 42
                    ? " border-red-500 border"
                    : "border-none"
                } h-16 py-2 px-1 flex rounded-2xl bg-[#1F1F1F]`}
              >
                <div className="w-[99%] py-1.5 flex items-center justify-center bg-slate-50/0">
                  <input
                    className={`w-[90%] h-[90%] ml-3 mr-auto text-[18px] bg-transparent outline-none`}
                    onChange={handleChange}
                    type="text"
                    placeholder="Address"
                    value={receiveAddress}
                  />
                  <div
                    className=" mr-3 ml-2 mt-1 h-[100%] bg-slate-400/0"
                    onClick={() => scan()}
                  >
                    <img src="/assets/scanner.svg" className="h-7  w-7 mt-0" />
                  </div>
                </div>
              </div>
              <div>
                {receiveAddress.length > 0 && receiveAddress.length < 42 ? (
                  <>
                    <p className="text-[#FC4444] text-[14px]">
                      Invalid address
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="w-[99%] flex flex-col py-2 px-1 h-[60%] bg-black/0">
              <div className="mt-[360px] w-[98%] ml-auto mr-auto">
                <button
                  onClick={() => {
                    if (receiveAddress.length >= 40) {
                      setIsAddressChecked(true);
                    }
                  }}
                  className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/90 h-14"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
