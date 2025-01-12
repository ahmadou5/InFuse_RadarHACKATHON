'use client';
import { Menu } from '@/components/Menu/Menu';
import { useAuth } from '@/context/AuthContext';
import { useNetwork } from '@/context/NetworkContext';
import { Tokens } from '@/interfaces/models.interface';
import { fetchCompressedTokens } from '@/lib/compressed.lib';
import {
  calculateWalletTotals,
  getSolPrice,
  getTokenPrice,
  getTokenPrices,
} from '@/lib/helper.lib';
import { TokenService } from '@/lib/services/TokenServices';
import { getSplTokenBalance } from '@/lib/solana.lib';
import { useTelegramBackButton } from '@/lib/telegram.lib';
import { Token } from '@/utils/tokens.utils';
import { BN254, ParsedTokenAccount } from '@lightprotocol/stateless.js';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from '@solana/web3.js';
import { useQRScanner } from '@telegram-apps/sdk-react';
import { normalizeTokenAmount } from 'helius-airship-core';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface TokenPrices {
  [ticker: string]: number;
}

interface CompressTokenItemProps {
  address: string;
  balance: BN254;
  onClick: () => void;
}

interface TokenItemProps {
  token: Tokens;
  balance: number | undefined;
  price: number | undefined;
  onClick: () => void;
}
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
};
const CompressTokenItem: React.FC<CompressTokenItemProps> = ({
  address,
  balance,
  onClick,
}) => {
  const [tokenInfo, setTokenInfo] = useState<Tokens | null>(null);
  const [tokenPrice, setTokenPrice] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const getTokenInfo = useCallback(async (slug: string) => {
    try {
      setIsLoading(true);
      // Filter token info
      const response = Token.filter((token) => token.compress_address === slug);

      if (response && response.length > 0) {
        setTokenInfo(response[0]);

        // Fetch price only if we have valid token info
        const ticker = response[0].token_id;
        const price = await getTokenPrice(ticker);
        setTokenPrice(price);
      }
    } catch (error) {
      console.error('Failed to fetch token info:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (address) {
      getTokenInfo(address);
    }
  }, [address, getTokenInfo]);

  // Calculate normalized balance
  const normalizedBalance = balance
    ? normalizeTokenAmount(balance.toString(), 6)
    : 0;

  // Calculate total value
  const totalValue = tokenPrice ? normalizedBalance * tokenPrice : 0;

  if (isLoading) {
    return (
      <div className="bg-white/10 w-[90%] mb-1.5 flex items-center justify-center rounded-xl h-[70px]">
        <div className="animate-pulse flex w-full items-center px-6">
          <div className="rounded-full bg-white/20 h-12 w-12" />
          <div className="flex-1 ml-4 space-y-2">
            <div className="h-4 bg-white/20 rounded w-1/4" />
            <div className="h-4 bg-white/20 rounded w-1/3" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-white/20 rounded w-16" />
            <div className="h-4 bg-white/20 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  if (!tokenInfo) {
    return null;
  }

  return (
    <div
      onClick={onClick}
      className="bg-white/10 w-[90%] mb-1.5 flex items-center justify-center rounded-xl h-[70px] cursor-pointer"
    >
      <div className="bg-gothic-600/85 w-12 flex items-center justify-center h-12 ml-[23px] mr-[10px] rounded-full">
        {tokenInfo.logoUrl && (
          <img
            src={tokenInfo.logoUrl}
            alt={tokenInfo.name}
            className="text-white/90 w-full h-full rounded-full"
            onError={(e) => {
              e.currentTarget.src = './assets/5426.png'; // Fallback image
            }}
          />
        )}
      </div>

      <div className="ml-[5px] text-white/85 mr-auto px-3">
        <p className="text-sm font-bold mb-1">{`c${tokenInfo.name}`}</p>
        <p className="text-sm">{normalizedBalance.toFixed(2)}</p>
      </div>

      <div className="ml-[10px] mt-1 text-white/85 mr-4 px-3">
        <p className="text-[15px] mb-1">${tokenPrice?.toFixed(2) ?? '0.00'}</p>
        <div className="text-[15px]">${totalValue.toFixed(2)}</div>
      </div>
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
          } ${token.ticker?.toUpperCase()}`
        )}
      </p>
    </div>
    <div className="ml-[10px] mt-1 text-white/85 mr-4 px-3">
      <p className="text-[15px] mb-1">
        {price ? (
          `$${price.toFixed(1)}`
        ) : (
          <span className="block bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></span>
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
  const [compTokens, setCompTokens] = useState<ParsedTokenAccount[]>();
  const [tokens, setTokens] = useState<Tokens[]>([]);
  const { user } = useAuth();
  const { network } = useNetwork();
  const [activeTab, setActiveTab] = useState('assets');
  const router = useRouter();
  const connection = useMemo(
    () =>
      new Connection(network.rpcUrl || clusterApiUrl('devnet'), {
        commitment: 'confirmed',
      }),
    []
  );
  const scanner = useQRScanner(false);

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
  useTelegramBackButton();
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        if (!user) {
          return;
        }
        const userAddress = new PublicKey(user?.solPublicKey);
        const price = await getSolPrice(network.native?.token_id || '');
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
      if (!user) return;

      const CompresstokenList = await fetchCompressedTokens({
        address: user.solPublicKey,
        rpc: network.rpcUrl || '',
      });
      const deduplicatedAccounts = CompresstokenList.items.reduce(
        (acc, current) => {
          const existingAccount = acc.find((item) =>
            item.parsed.mint.equals(current.parsed.mint)
          );
          if (existingAccount) {
            existingAccount.parsed.amount = existingAccount.parsed.amount.add(
              current.parsed.amount
            );
          } else {
            acc.push(current);
          }
          return acc;
        },
        [] as typeof CompresstokenList.items
      );
      setCompTokens(deduplicatedAccounts);
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
          console.error('Invalid token data received:', response);
          setTokens([]); // Set to empty array if data is invalid
        }
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
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
            user.solPublicKey
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
  }, [connection, tokens, user]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (tokens.length > 0) {
        try {
          const tickers = tokens.map((token) => token.token_id);
          const prices = await getTokenPrices(tickers);
          setTokenPrices(Object.fromEntries(prices));
        } catch (error) {
          console.error('Failed to fetch token prices:', error);
        }
      }
    };

    fetchPrices();
  }, [tokens]);

  const scan = () => {
    try {
      scanner.open('Scan QR code').then((content) => {
        if (!content) {
          return;
        }
        router.push(`/send/${network.native?.name.toLowerCase()}/${content}`);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[100%] flex items-center justify-center flex-col">
      <div className="bg-gothic-950/0 mt-0.5 flex  mb-2 flex-col items-center justify-center w-[100%] h-auto">
        <div className="p-2 mb-4 w-full flex">
          <Link
            className="mr-auto ml-1.5 flex items-center justify-center rounded-full"
            title="Settings"
            href="/settings"
          >
            <Image
              src="./assets/setting.svg"
              className="text-white"
              alt=""
              height={32}
              width={32}
            />
          </Link>
          <button
            onClick={() => scan()}
            className="mr-1.5 ml-auto flex items-center justify-center rounded-full"
            title="Scan QR Code"
          >
            <Image
              src="./assets/scanner.svg"
              className="text-white"
              alt=""
              height={32}
              width={32}
            />
          </button>
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
          <Link
            title="Send"
            href={`/send/${network.native?.name.toLowerCase()}`}
            className="text-xl bg-white/10 border-[#448cff]/25 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto text-white/60"
          >
            <Image
              src="https://solana-wallet-orcin.vercel.app/assets/send.svg"
              className="mt-1"
              alt=""
              width={32}
              height={32}
            />
          </Link>

          <Link
            title="Receive"
            href="/receive"
            className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto text-white/60"
          >
            <Image
              src="https://solana-wallet-orcin.vercel.app/assets/qr.svg"
              className="mt-1"
              alt=""
              width={32}
              height={32}
            />
          </Link>

          <Link
            title="Ramp"
            href={`/ramp/${network?.name?.toLowerCase()}`}
            className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-20 w-20 ml-auto mr-auto text-white/60"
          >
            <Image
              src="https://solana-wallet-orcin.vercel.app/assets/dollar.svg"
              className="mt-1"
              alt=""
              width={32}
              height={32}
            />
          </Link>
        </div>
      </div>

      <div className="bg-gothic-950/0 mt-8 flex flex-col items-center justify-center w-[100%] h-auto">
        <div className="flex justify-around mb-6 bg-white/0 bg-opacity-10 rounded-xl p-1">
          {network.name === 'SOLANA' &&
            ['Assets', 'cAssets'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 px-6 w-[130px] rounded-xl ml-2 mr-2 text-sm font-medium ${
                  activeTab.toLowerCase() === tab.toLowerCase()
                    ? 'bg-white/10 bg-opacity-20 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          {network.name !== 'SOLANA' &&
            ['Assets'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 px-6 w-[130px] rounded-xl ml-2 mr-2 text-sm font-medium bg-white/10 bg-opacity-20 text-white"}`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
        </div>

        {activeTab === 'assets' ? (
          <>
            <TokenItem
              token={{
                name: network?.native?.name || '',
                ticker: network.native?.ticker || '',
                token_id: network.native?.ticker || '',
                chain: network.name,
                isEvm: network.isEVM,
                isMainnet: network.isTestNet,
                address: '',
                owner: '',
                compress_address: '',
                logoUrl:
                  network.native?.logoUrl ||
                  'https://solana-wallet-orcin.vercel.app/assets/5426.png',
              }}
              balance={solBalance}
              price={solPrice}
              onClick={() =>
                router.push(`/token/${network.native?.name.toLowerCase()}`)
              }
            />
            {network.isTestNet === true ? (
              <>
                {tokens
                  .filter(
                    (token) =>
                      token.chain === network.name.toLowerCase() &&
                      token.isMainnet === false
                  )
                  .map((token, i) => (
                    <TokenItem
                      key={i}
                      token={token}
                      balance={tokenBalances[token.address]}
                      price={tokenPrices[token.token_id]}
                      onClick={() => router.push(`/token/${token.address}`)}
                    />
                  ))}
              </>
            ) : (
              <>
                {tokens
                  .filter(
                    (token) =>
                      token.chain === network.name.toLowerCase() &&
                      token.isMainnet === true
                  )
                  .map((token, i) => (
                    <TokenItem
                      key={i}
                      token={token}
                      balance={tokenBalances[token.address]}
                      price={tokenPrices[token.token_id]}
                      onClick={() => router.push(`/token/${token.address}`)}
                    />
                  ))}
              </>
            )}
          </>
        ) : (
          <>
            {compTokens?.length === 0 ? (
              'You have no Compressed Asset'
            ) : (
              <>
                {compTokens &&
                  compTokens.map((token, i) => (
                    <CompressTokenItem
                      key={i}
                      address={token.parsed.mint.toString()}
                      balance={token.parsed.amount}
                      onClick={() => {
                        router.push(
                          `/token/compress/${token.parsed.mint.toBase58()}`
                        );
                      }}
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
