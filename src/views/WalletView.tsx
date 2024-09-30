"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getSolPrice, getTokenPrices } from "@/lib/helper.lib";
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Menu } from "@/components/Menu/Menu";
import { useQRScanner } from "@telegram-apps/sdk-react";
import { getSplTokenBalance } from "@/lib/solana.lib";
interface Token {
  name: string;
  ticker: string;
  id: string;
  getId: string;
  imgUrl: string;
}

interface TokenPrices {
  [ticker: string]: number;
}

type TeamList = Token[];

interface TokenItemProps {
  token: Token;
  balance: number|undefined;
  price: number|undefined;
  onClick: () => void;
}

const TokenItem: React.FC<TokenItemProps> = ({ token, balance, price, onClick }) => (
  <div onClick={onClick} className="bg-white/10 w-[90%] mb-1.5 flex items-center justify-center rounded-xl h-[70px] cursor-pointer">
    <div className="bg-gothic-600/85 w-12 flex items-center justify-center h-12 ml-[23px] mr-[10px] rounded-full">
      <img src={token.imgUrl} alt={token.name} className="text-white/90 w-full h-full rounded-full" />
    </div>
    <div className="ml-[5px] text-white/85 mr-auto px-3">
      <p className="text-sm font-bold mb-1">{token.name}</p>
      <p className="text-sm">
        {balance === undefined ? (
          <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
        ) : (
          `${balance} ${token.ticker}`
        )}
      </p>
    </div>
    <div className="ml-[10px] text-white/85 mr-4 px-3">
      <p className="text-[15px] mb-1">
        {price ? (
          `$${price.toFixed(2)}`
        ) : (
          <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
        )}
      </p>
      <div className="text-[15px]">
        {balance !== undefined && price !== undefined ? (
          `$${(balance * price).toFixed(2)}`
        ) : (
          <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
        )}
      </div>
    </div>
  </div>
);


export const WalletView = () => {
  const [tokenBalances, setTokenBalances] = useState<{[address: string]: number}>({});
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({});
  const [solBalance,setSolBalance] = useState<number|undefined>()
  const [solPrice,setSolPrice] = useState<number|undefined>()
  const { user} = useAuth()
  const [activeTab, setActiveTab] = useState("tokens");
  const router = useRouter()
  const connection = new Connection(clusterApiUrl('devnet'), { commitment: 'confirmed' });
  const scanner = useQRScanner(false)
  console.log(scanner)
  const token1: TeamList = [
    {
      name: 'Bonk',
      ticker: 'bonk',
      id: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      getId: 'bonk',
      imgUrl: 'https://coin-images.coingecko.com/coins/images/28600/large/bonk.jpg?1696527587'
    },
  ];

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        if(!user) {
          return
        }
        const userAddress = new PublicKey(user?.publicKey)
        const price = await getSolPrice('solana')
        const balance = await connection.getBalance(userAddress)
        setSolPrice(price)
        setSolBalance(balance/LAMPORTS_PER_SOL)
      } catch (error) {
        throw error
      }
    }
    fetchSolPrice()
  },[])
  useEffect(() => {
    const fetchPrices = async () => {
      if (token1.length > 0) {
        try {
          const tickers = token1.map(token => token.ticker);
          const prices = await getTokenPrices(tickers);
          setTokenPrices(Object.fromEntries(prices));
        } catch (error) {
          console.error('Failed to fetch token prices:', error);
        }
      }
    };

    fetchPrices();
  }, [token1]);
 
  useEffect(() => {
    const fetchBalances = async () => {
      if (!user) return;

      const initialBalances = token1.reduce((acc, token) => {
        acc[token.id] = 0;
        return acc;
      }, {} as {[address: string]: number});
      setTokenBalances(initialBalances);

      for (const token of token1) {
        try {
          const balance = await getSplTokenBalance(connection, token.id, user.publicKey);
          setTokenBalances(prev => ({ ...prev, [token.id]: balance }));
        } catch (error) {
          console.error(`Failed to fetch balance for token ${token.id}:`, error);
        }
      }
    };

    fetchBalances();
  }, []);


  const scan = () => {
    try {
      scanner.open('Scan QR code').then((content) => {
        console.log(content);
        
      });
      console.log(scanner.isOpened); // true
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-[100%]">
      <div className="bg-gothic-950/0 mt-0.5 flex  mb-2 flex-col items-center justify-center w-[100%] h-auto">
        <div className="p-2 mb-4 w-full flex">
          <div onClick={() => router.replace('/settings') } className="mr-auto ml-1.5 flex items-center justify-center rounded-full">
            <img
              src="./assets/setting.svg"
              className="text-white"
            />
          </div>
          <div onClick={() => scan() } className=" mr-1.5  ml-auto flex items-center justify-center rounded-full">
            <img
              src="./assets/scanner.svg"
              className="text-white"
            />
          </div>
          
        </div>
        <div className="bg-s-gray-300/0 w-[90%] flex flex-col items-center justify-center rounded-3xl h-[120px]">
          <p className="text-[22px] font-light text-[#666666] mb-2.5">
            Total Balance
          </p>
          <p className="text-5xl font-bold text-white/65">{`$${0}`}</p>
        </div>
      </div>
      <div className="bg-gothic-950/0 mt-3 flex items-center justify-center w-[100%] h-auto">
        <div className="bg-gothic-300/0 w-[90%] flex items-center justify-center rounded-3xl h-[100px]">
          <div onClick={() => router.push(`/send/solana`)} className="text-xl bg-white/10  border-[#448cff]/25 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/send.svg"
              className="mt-1"
            />
            
          </div>
          <div onClick={() => router.push(`/receive`)} className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/qr.svg"
              className="mt-1"
            />
            
          </div>
          <div onClick={() => router.push(`/ramp`)} className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60">
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/dollar.svg"
              className="mt-1"
            />
          
          </div>
        </div>
      </div>

      <div className="bg-gothic-950/0 mt-8 flex flex-col items-center justify-center w-[100%] h-auto">
      <div className="flex justify-around mb-6 bg-white/0 bg-opacity-10 rounded-xl p-1">
          {["tokens", "NFT's"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-6 rounded-lg ml-2 mr-2 text-sm font-medium ${
                activeTab.toLowerCase() === tab.toLowerCase()
                  ? "bg-white/10 bg-opacity-20 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 'tokens' ? (
          <>
            <TokenItem
              token={{ name: "Solana", ticker: "SOL", id:'' , getId: '', imgUrl: "https://solana-wallet-orcin.vercel.app/assets/5426.png" }}
              balance={solBalance}
              price={solPrice}
              onClick={() => router.push('/token/solana')}
            />
            {token1.map((token, i) => (
              <TokenItem
                key={i}
                token={token}
                balance={tokenBalances[token.id]}
                price={tokenPrices[token.ticker]}
                onClick={() => router.push(`/token/${token.ticker}`)}
              />
            ))}
          </>
        ) : (
          'NFTs content here'
        )}
        
      </div>
      <Menu />
    </div>
  );
};