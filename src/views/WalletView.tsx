"use client";
import { useState, useEffect } from "react";
import { ParsedTokenAccount, WithCursor } from "@lightprotocol/stateless.js";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getSolPrice, getTokenPrices } from "@/lib/helper.lib";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { Menu } from "@/components/Menu/Menu";
import { useQRScanner } from "@telegram-apps/sdk-react";
import { getSplTokenBalance } from "@/lib/solana.lib";
import { fetchCompressedTokens } from "@/lib/compressed.lib";
import { TokenService } from "@/lib/services/TokenServices";
import { Tokens } from "@/interfaces/models.interface";
import { calculateWalletTotals } from "@/lib/helper.lib";

interface TokenPrices {
  [ticker: string]: number;
}

interface CompressTokenItemProps {
  address: string;

  onClick: () => void;
}

interface TokenItemProps {
  token: Tokens;
  balance: number | undefined;
  price: number | undefined;
  onClick: () => void;
}
const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
};
const CompressTokenItem: React.FC<CompressTokenItemProps> = ({
  address,
  onClick,
}) => {
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const getTokenInfo = async (slug: string) => {
    try {
      // setIsLoading(true);
      // console.log('Fetching token info for slug:', slug);
      const response = await TokenService.getCompressToken(slug);
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
  useEffect(() => {
    getTokenInfo(address);
  }, []);
  //alert(address);
  return (
    <div
      onClick={onClick}
      className="bg-white/10 w-[90%] mb-1.5 flex items-center justify-center rounded-xl h-[70px] cursor-pointer"
    >
      <div className="bg-gothic-600/85 w-12 flex items-center justify-center h-12 ml-[23px] mr-[10px] rounded-full">
        <img
          src={tokenInfo[0]?.logoUrl}
          alt={tokenInfo[0]?.name}
          className="text-white/90 w-full h-full rounded-full"
        />
      </div>
      <div className="ml-[5px] text-white/85 mr-auto px-3">
        <p className="text-sm font-bold mb-1">{`c${tokenInfo[0].name}`}</p>
      </div>
      {/** <p className="text-sm">
        {balance === undefined ? (
            <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
          ) : (
            `${
              balance?.toString().length > 7
                ? formatNumber(balance)
                : balance?.toString()
            } ${token.ticker}`
          )}
        </p>
      </div> */}
      {/** <div className="ml-[10px] mt-1 text-white/85 mr-4 px-3">
        <p className="text-[15px] mb-1">
          {price ? (
            `$${price.toFixed(1)}`
          ) : (
            <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
          )}
        </p>
        <div className="text-[15px]">
          {balance !== undefined && price !== undefined ? (
            `$${(balance * price).toFixed(1)}`
          ) : (
            <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
          )}
        </div>
      </div>  */}
    </div>
  );
};

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
      <img
        src={token.logoUrl}
        alt={token.name}
        className="text-white/90 w-full h-full rounded-full"
      />
    </div>
    <div className="ml-[5px] text-white/85 mr-auto px-3">
      <p className="text-sm font-bold mb-1">{token.name}</p>
      <p className="text-sm">
        {balance === undefined ? (
          <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
        ) : (
          `${
            balance?.toString().length > 7
              ? formatNumber(balance)
              : balance?.toString()
          } ${token.ticker}`
        )}
      </p>
    </div>
    <div className="ml-[10px] mt-1 text-white/85 mr-4 px-3">
      <p className="text-[15px] mb-1">
        {price ? (
          `$${price.toFixed(1)}`
        ) : (
          <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
        )}
      </p>
      <div className="text-[15px]">
        {balance !== undefined && price !== undefined ? (
          `$${(balance * price).toFixed(1)}`
        ) : (
          <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
        )}
      </div>
    </div>
  </div>
);

interface WalletTotals {
  totalValue: number;
  solValue: number;
  tokenValue: number;
}

export const WalletView = () => {
  const [tokenBalances, setTokenBalances] = useState<{
    [address: string]: number;
  }>({});
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({});
  const [solBalance, setSolBalance] = useState<number | undefined>();
  const [solPrice, setSolPrice] = useState<number | undefined>();
  const [compTokens, setCompTokens] = useState<
    WithCursor<ParsedTokenAccount[]> | undefined
  >();
  const [tokens, setTokens] = useState<Tokens[]>([]);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tokens");
  const router = useRouter();
  const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
  });
  const scanner = useQRScanner(false);
  //console.log(scanner)
  const [walletTotals, setWalletTotals] = useState<WalletTotals>({
    totalValue: 0,
    solValue: 0,
    tokenValue: 0,
  });

  // Add this useEffect to calculate totals whenever relevant values change
  useEffect(() => {
    const totals = calculateWalletTotals(
      solBalance,
      solPrice,
      tokenBalances,
      tokenPrices,
      tokens
    );
    setWalletTotals(totals);
  }, [solBalance, solPrice, tokenBalances, tokenPrices, tokens]);

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        if (!user) {
          return;
        }
        const userAddress = new PublicKey(user?.publicKey);
        const price = await getSolPrice("solana");
        const balance = await connection.getBalance(userAddress);
        setSolPrice(price);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        throw error;
      }
    };
    fetchSolPrice();
  }, []);

  useEffect(() => {
    const fetchCompress = async () => {
      console.log("fetching compress");
      if (!user) return;

      const CompresstokenList = await fetchCompressedTokens(user.publicKey);
      setCompTokens(CompresstokenList);
      console.log("compress", CompresstokenList);
    };
    fetchCompress();
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await TokenService.getTokens();

        if (response.data && Array.isArray(response.data)) {
          setTokens(response.data);
        } else {
          console.error("Invalid token data received:", response);
          setTokens([]); // Set to empty array if data is invalid
        }
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        setTokens([]); // Set to empty array on error
      }
    };
    fetchTokens();
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!user) return;

      const initialBalances = tokens.reduce((acc, token) => {
        acc[token.address] = 0;
        return acc;
      }, {} as { [address: string]: number });
      setTokenBalances(initialBalances);

      for (const token of tokens) {
        try {
          const balance = await getSplTokenBalance(
            connection,
            token.address,
            user.publicKey
          );
          setTokenBalances((prev) => ({ ...prev, [token.address]: balance }));
        } catch (error) {
          console.error(
            `Failed to fetch balance for token ${token.address}:`,
            error
          );
        }
      }
    };

    fetchBalances();
  }, [tokens]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (tokens.length > 0) {
        try {
          const tickers = tokens.map((token) => token.token_id);
          const prices = await getTokenPrices(tickers);
          setTokenPrices(Object.fromEntries(prices));
        } catch (error) {
          console.error("Failed to fetch token prices:", error);
        }
      }
    };

    fetchPrices();
  }, [tokens]);

  const scan = () => {
    try {
      scanner.open("Scan QR code").then((content) => {
        console.log(content);
      });
      console.log(scanner.isOpened); // true
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[100%] flex items-center justify-center flex-col">
      <div className="bg-gothic-950/0 mt-0.5 flex  mb-2 flex-col items-center justify-center w-[100%] h-auto">
        <div className="p-2 mb-4 w-full flex">
          <div
            onClick={() => router.replace("/settings")}
            className="mr-auto ml-1.5 flex items-center justify-center rounded-full"
          >
            <img src="./assets/setting.svg" className="text-white" />
          </div>
          <div
            onClick={() => scan()}
            className=" mr-1.5  ml-auto flex items-center justify-center rounded-full"
          >
            <img src="./assets/scanner.svg" className="text-white" />
          </div>
        </div>
        <div className="bg-s-gray-300/0 w-[90%] flex flex-col items-center justify-center rounded-3xl h-[120px]">
          <p className="text-[22px] font-light text-[#666666] mb-2.5">
            Total Balance
          </p>
          <p className="text-5xl font-bold text-white/65">{`$${walletTotals.totalValue.toFixed(
            2
          )}`}</p>
        </div>
      </div>
      <div className="bg-gothic-950/0 mt-3 flex items-center justify-center w-[100%] h-auto">
        <div className="bg-gothic-300/0 w-[90%] flex items-center justify-center rounded-3xl h-[100px]">
          <div
            onClick={() => router.push(`/send/solana`)}
            className="text-xl bg-white/10  border-[#448cff]/25 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60"
          >
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/send.svg"
              className="mt-1"
            />
          </div>
          <div
            onClick={() => router.push(`/receive`)}
            className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60"
          >
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/qr.svg"
              className="mt-1"
            />
          </div>
          <div
            onClick={() => router.push("/ramp/solana")}
            className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto  text-white/60"
          >
            <img
              src="https://solana-wallet-orcin.vercel.app/assets/dollar.svg"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="bg-gothic-950/0 mt-8 flex flex-col items-center justify-center w-[100%] h-auto">
        <div className="flex justify-around mb-6 bg-white/0 bg-opacity-10 rounded-xl p-1">
          {["Tokens", "Compressed"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-6 w-[130px] rounded-xl ml-2 mr-2 text-sm font-medium ${
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
                name: "SOLANA",
                ticker: "SOL",
                token_id: "solana",
                address: "",
                owner: "",
                compress_address: "",
                logoUrl:
                  "https://solana-wallet-orcin.vercel.app/assets/5426.png",
              }}
              balance={solBalance}
              price={solPrice}
              onClick={() => router.push("/token/solana")}
            />
            {tokens.map((token, i) => (
              <TokenItem
                key={i}
                token={token}
                balance={tokenBalances[token.address]}
                price={tokenPrices[token.token_id]}
                onClick={() => router.push(`/token/${token.token_id}`)}
              />
            ))}
          </>
        ) : (
          <>
            {compTokens?.items.length === 0 ? (
              "You have not Compress Token yet"
            ) : (
              <>
                {compTokens &&
                  compTokens.items.map((token, i) => (
                    <CompressTokenItem
                      key={i}
                      address={token.parsed.mint.toString()}
                      onClick={() => alert(token.parsed.mint.toString())}
                    />
                  ))}
              </>
            )}
          </>
        )}
      </div>
      <Menu />
    </div>
  );
};
