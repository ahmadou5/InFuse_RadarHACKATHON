import { useAuth } from '@/context/AuthContext';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import toast, { Toaster } from 'react-hot-toast';

import { useRouter } from 'next/navigation';
import { useMini } from '@/context/MiniContext';
import { Token } from '@/utils/tokens.utils';
import { useEffect, useState } from 'react';
import { Tokens } from '@/interfaces/models.interface';
import { useNetwork } from '@/context/NetworkContext';
export const Activities = ({ slug }: Params) => {
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const { user } = useAuth();
  const { network } = useNetwork();
  const { setIsCompressed } = useMini();

  const router = useRouter();
  const getTokenInfo = async (address: string) => {
    try {
      const response = Token.filter((token) => token.address === address);

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
  const hanleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(
      () => {
        toast.success('Copied.Successfully');
      },
      (err) => {
        // Failed to copy to clipboard
        toast.error('Could not copy: ', err);
      }
    );
  };
  useEffect(() => {
    getTokenInfo(slug[0]);
  }, []);

  return (
    <>
      <div className="bg-gothic-300/0 w-[90%] ml-auto mr-auto mb-5 flex items-center justify-center rounded-3xl h-[100px]">
        <div
          onClick={() => {
            slug[0] = network.native?.name.toLowerCase()
              ? router.replace(`/send/${slug[0]}`)
              : router.replace(`/send/${tokenInfo[0]?.address}`);
          }}
          className="text-xl bg-white/10  border-[#448cff]/25 flex flex-col items-center justify-center rounded-3xl h-16 w-16 ml-auto mr-auto  text-white/60"
        >
          <img
            src="https://solana-wallet-orcin.vercel.app/assets/send.svg"
            className="mt-1"
          />
        </div>
        <div
          onClick={() => {
            if (!user) return;
            hanleCopy(user?.solPublicKey);
          }}
          className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-16 w-16 ml-auto mr-auto  text-white/60"
        >
          <img src="/assets/link.svg" className="mt-1" />
        </div>
        <div
          onClick={() => router.replace(`/ramp/${tokenInfo[0].token_id}`)}
          className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-16 w-16 ml-auto mr-auto  text-white/60"
        >
          <img
            src="https://solana-wallet-orcin.vercel.app/assets/dollar.svg"
            className="mt-1"
          />
        </div>
        {slug[0] === 'solana' ? (
          <></>
        ) : (
          <div
            onClick={() => setIsCompressed(true)}
            className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-16 w-16 ml-auto mr-auto  text-white/60"
          >
            <img src="/assets/comp.svg" className="mt-1" />
          </div>
        )}

        <Toaster />
      </div>
    </>
  );
};
