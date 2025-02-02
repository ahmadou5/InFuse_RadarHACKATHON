import { useAuth } from '@/context/AuthContext';
import { useNetwork } from '@/context/NetworkContext';
import { Tokens } from '@/interfaces/models.interface';
import { getCompressTokenBalance } from '@/lib/compressed.lib';
import { SolConverter } from '@/lib/helper.lib';
import { Token } from '@/utils/tokens.utils';
import { BN } from '@coral-xyz/anchor';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { normalizeTokenAmount } from 'helius-airship-core';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface TopProps {
  tokenId: string;
}

export const CTop = ({ tokenId }: TopProps) => {
  const { user } = useAuth();
  const { network } = useNetwork();
  const [userBalance, setUserBalance] = useState<BN | null>(null);
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const connection = new Connection(network.rpcUrl || clusterApiUrl('devnet'), {
    commitment: 'confirmed',
  });

  const getTokenInfo = async (slug: string) => {
    try {
      const response = Token.filter((token) => token.compress_address === slug);

      if (response && Array.isArray(response)) {
        setTokenInfo(response);
        return response;
      } else {
        console.error('Invalid token data received:', response);
        setTokenInfo([]);
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      setTokenInfo([]);
    }
  };

  const fetchBalances = async () => {
    try {
      if (tokenId[0] === 'solana') {
        if (!user) return;
        let userPubKey: PublicKey;
        try {
          userPubKey = new PublicKey(user.solPublicKey);
        } catch (error) {
          throw new Error('Invalid sender address');
        }

        await connection.getBalance(userPubKey);
      } else {
        if (!user) return;
        const balance = await getCompressTokenBalance({
          address: user.solPublicKey,
          mint: tokenId[1],
          rpc: network.rpcUrl || '',
        });
        setUserBalance(balance?.items[0]?.balance);
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.error(error.message);
      else console.error(error);
    }
  };

  const fetch = async () => {
    try {
      const tokenDetails = await getTokenInfo(tokenId[1]);
      if (!tokenDetails) return;
      await fetchBalances();
    } catch (error) {
      console.error(error);
    }
  };
  const router = useRouter();

  useEffect(() => {
    fetch();
  }, [user]);
  return (
    <div className="bg-white/0 w-[96%] mt-2 ml-auto mr-auto py-1 px-2 rounded-lg ">
      <div className="flex items-center justify-between px-1 py-1">
        <button onClick={() => router.back()} className="flex items-center">
          <ChevronLeft className="w-6 h-6 mr-4" />
          <h1 className="text-xl font-medium">
            {`c${
              tokenId[0] === network.native?.name.toLowerCase()
                ? network.native.name
                : tokenInfo[0]?.name
            }`}
          </h1>
        </button>
      </div>

      <div className=" bg-slate-50/0 mb-[20px] py-2 px-2 h-[80px] w-[100%] flex  ">
        {tokenId[0] === 'solana' ? (
          <div className="bg-white/5 flex items-center ml-7 justify-center w-[70px] rounded-full h-[70px]">
            <Image
              className="rounded-full w-[98%] h-[98%]"
              src={
                tokenId[0] === 'solana'
                  ? 'https://solana-wallet-orcin.vercel.app/assets/5426.png'
                  : tokenInfo[0]?.logoUrl
              }
              alt="solana"
              width={100}
              height={100}
            />
          </div>
        ) : (
          <div>
            {tokenInfo[0] === undefined ? (
              <div className="bg-white/20 h-[70px] w-[70px] ml-7 mb-2 animate-pulse rounded"></div>
            ) : (
              <div className="bg-white/5 flex items-center ml-7 justify-center w-[70px] rounded-full h-[70px]">
                <Image
                  className="rounded-full w-[98%] h-[98%]"
                  src={
                    tokenId === 'solana'
                      ? 'https://solana-wallet-orcin.vercel.app/assets/5426.png'
                      : tokenInfo[0]?.logoUrl
                  }
                  alt={tokenInfo[0]?.name}
                  width={100}
                  height={100}
                />
              </div>
            )}{' '}
          </div>
        )}

        <div className="ml-auto text-xl font-bold mt-8 mr-2">
          {tokenId[0] === 'solana' ? (
            <div className="flex">
              {' '}
              <p className="ml-2 text-4xl mr-2">{`${
                userBalance === null ? (
                  <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded-xl"></div>
                ) : (
                  SolConverter(
                    normalizeTokenAmount(userBalance.toString(), 6)
                  ).toFixed(2)
                )
              }`}</p>
              <p className="mt-3">{` ${
                tokenId[0] === 'solana' ? 'SOL' : tokenInfo[0]?.name
              }`}</p>
            </div>
          ) : (
            <div>
              {tokenInfo[0] === undefined ? (
                <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
              ) : (
                <div className="flex">
                  {' '}
                  <p className="ml-2 text-4xl mr-2">{`${
                    userBalance === null
                      ? '0.00'
                      : normalizeTokenAmount(
                          userBalance.toString(),
                          6
                        )?.toFixed(2)
                  }`}</p>
                  <p className="mt-[11px]">
                    {`c${tokenId[0] === 'solana' ? 'SOL' : tokenInfo[0]?.name}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
