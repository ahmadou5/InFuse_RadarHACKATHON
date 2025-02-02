"use client";
import { Menu } from "@/components/Menu/Menu";
import { useAuth } from "@/context/AuthContext";
import { getTokenPricesV2 } from "@/lib/helper.lib";
import { getSplTokenBalance } from "@/lib/solana.lib";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useQRScanner } from "@telegram-apps/sdk-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

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

const token1: TeamList = [
  {
    name: "Solana",
    ticker: "solana",
    id: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    getId: "solana",
    imgUrl:
      "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
  },
  {
    name: "Bonk",
    ticker: "bonk",
    id: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    getId: "bonk",
    imgUrl:
      "https://coin-images.coingecko.com/coins/images/28600/large/bonk.jpg?1696527587",
  },
];

export const WalletView = () => {
  const [tokenBalances, setTokenBalances] = useState<{
    [address: string]: number;
  }>({});
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({});
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tokens");
  const router = useRouter();
  const scanner = useQRScanner(false);
  const connection = useMemo(
    () =>
      new Connection(clusterApiUrl("devnet"), {
        commitment: "confirmed",
      }),
    []
  );

  useEffect(() => {
    const fetchPrices = async () => {
      if (token1.length > 0) {
        try {
          const tickers = token1.map((token) => token.ticker);
          const prices = await getTokenPricesV2(tickers);
          setTokenPrices(Object.fromEntries(prices));
        } catch (error) {
          console.error("Failed to fetch token prices:", error);
        }
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!user) return;

      const initialBalances = token1.reduce((acc, token) => {
        acc[token.id] = 0;
        return acc;
      }, {} as { [address: string]: number });
      setTokenBalances(initialBalances);

      for (const token of token1) {
        try {
          const balance = await getSplTokenBalance(
            connection,
            token.id,
            user.solPublicKey
          );
          setTokenBalances((prev) => ({ ...prev, [token.id]: balance }));
        } catch (error) {
          console.error(
            `Failed to fetch balance for token ${token.id}:`,
            error
          );
        }
      }
    };

    fetchBalances();
  }, [user, connection]);

  const scan = async () => {
    try {
      await scanner.open("Scan QR code");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gothic-950/0 mt-0.5 flex mb-2 flex-col items-center justify-center w-full h-auto">
        <div className="p-2 mb-4 w-full flex">
          <Link
            title="Settings"
            href="/settings"
            className="mr-auto ml-1.5 flex items-center justify-center rounded-full cursor-pointer"
          >
            <Image
              src="./assets/setting.svg"
              alt="Settings"
              className="text-white"
              height={20}
              width={20}
            />
          </Link>
          <div
            onClick={scan}
            className="mr-1.5 ml-auto flex items-center justify-center rounded-full cursor-pointer"
          >
            <Image
              src="./assets/scanner.svg"
              alt="Scanner"
              className="text-white"
              height={20}
              width={20}
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
      <div className="bg-gothic-950/0 mt-3 flex items-center justify-center w-full h-auto">
        <div className="bg-gothic-300/0 w-[90%] flex items-center justify-center rounded-3xl h-[100px]">
          {[
            { path: "/send/solana", icon: "send.svg", alt: "Send" },
            { path: "/receive", icon: "qr.svg", alt: "Receive" },
            { path: "/ramp", icon: "dollar.svg", alt: "Ramp" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className="text-xl bg-white/10 border-[#448cff]/25 flex flex-col items-center justify-center rounded-3xl h-20 w-20 mx-auto cursor-pointer"
            >
              <Image
                src={`https://solana-wallet-orcin.vercel.app/assets/${item.icon}`}
                alt={item.alt}
                className="mt-1"
                height={20}
                width={20}
              />
              <p>{item.alt}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gothic-950/0 mt-8 flex flex-col items-center justify-center w-full h-auto">
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
        {activeTab === "tokens" ? (
          <>
            <TokenItem
              token={{
                name: "Solana",
                ticker: "SOL",
                id: "",
                getId: "",
                imgUrl:
                  "https://solana-wallet-orcin.vercel.app/assets/5426.png",
              }}
              balance={2}
              price={150}
              onClick={() => router.push("/token/solana")}
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
          "NFTs content here"
        )}
      </div>
      <Menu />
    </div>
  );
};

interface TokenItemProps {
  token: Token;
  balance: number;
  price: number;
  onClick: () => void;
}

const TokenItem: React.FC<TokenItemProps> = ({
  token,
  balance,
  price,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-white/10 w-[90%] mb-1.5 flex items-center justify-center rounded-xl h-[70px] cursor-pointer"
  >
    <div className="bg-gothic-600/85 w-12 flex items-center justify-center h-12 ml-[23px] mr-[10px] rounded-full">
      <Image
        src={token.imgUrl}
        alt={token.name}
        className="text-white/90 w-full h-full rounded-full"
        height={20}
        width={20}
      />
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
