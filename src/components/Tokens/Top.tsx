import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
//import { TokenService } from "@/lib/services/TokenServices";
import { useAuth } from '@/context/AuthContext';
import { useNetwork } from '@/context/NetworkContext';
import { Tokens } from '@/interfaces/models.interface';
import { SolConverter } from '@/lib/helper.lib';
import { getSplTokenBalance } from '@/lib/solana.lib';
import { Token } from '@/utils/tokens.utils';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import Image from 'next/image';

interface TopProps {
  tokenId: string;
}

export const Top = ({ tokenId }: TopProps) => {
  const { user } = useAuth();
  const { network } = useNetwork();
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const connection = new Connection(network.rpcUrl || clusterApiUrl('devnet'), {
    commitment: 'confirmed',
  });

  const getTokenInfo = async (slug: string) => {
    try {
      const response = Token.filter((token) => token.address === slug);

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

  const fetchBalances = async (address: string) => {
    try {
      if (tokenId[0] === network.native?.token_id) {
        if (!user) return;
        let userPubKey: PublicKey;
        try {
          userPubKey = new PublicKey(user.solPublicKey);
        } catch (error) {
          throw new Error('Invalid sender address');
        }

        const balance = await connection.getBalance(userPubKey);
        setUserBalance(balance);
      } else {
        if (!user) return;
        const balance = await getSplTokenBalance(
          connection,
          address,
          user.solPublicKey
        );
        setUserBalance(balance);
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.error(error.message);
      else console.error(error);
    }
  };

  const fetch = async () => {
    try {
      const tokenDetails = await getTokenInfo(tokenId[0]);
      if (!tokenDetails) return;
      await fetchBalances(tokenDetails[0]?.address);
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
            {tokenId[0] === network.native?.name.toLowerCase()
              ? network.native.name
              : tokenInfo[0]?.name}
          </h1>
        </button>
      </div>

      <div className=" bg-slate-50/0 mb-[20px] py-2 px-2 h-[80px] w-[100%] flex  ">
        {tokenId[0] === network.native?.name.toLowerCase() ? (
          <div className="bg-white/5 flex items-center ml-7 justify-center w-[70px] rounded-full h-[70px]">
            <Image
              className="rounded-full w-[98%] h-[98%]"
              src={
                tokenId[0] === network.native?.name.toLowerCase()
                  ? network.native?.logoUrl
                  : tokenInfo[0]?.logoUrl
              }
              alt={tokenId[0]}
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
                    tokenId === network.native?.name.toLowerCase()
                      ? network.native?.logoUrl
                      : tokenInfo[0]?.logoUrl
                  }
                  alt={tokenInfo[0].name}
                  height={100}
                  width={100}
                />
              </div>
            )}{' '}
          </div>
        )}

        <div className="ml-auto text-xl font-bold mt-8 mr-2">
          {tokenId[0] === network.native?.name.toLowerCase() ? (
            <div className="flex">
              {' '}
              <p className="ml-2 text-4xl mr-2">{`${
                userBalance === null
                  ? '0.00'
                  : SolConverter(userBalance)?.toFixed(1)
              }`}</p>
              <p className="mt-3">{` ${
                tokenId[0] === network.native?.name.toLowerCase()
                  ? network.native?.ticker
                  : tokenInfo[0]?.name
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
                    userBalance === null ? '0.00' : userBalance.toFixed(1)
                  }`}</p>
                  <p className="mt-[11px]">
                    {` ${
                      tokenId[0] === network.native?.name.toLowerCase()
                        ? network.native?.ticker
                        : tokenInfo[0]?.name
                    }`}
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
