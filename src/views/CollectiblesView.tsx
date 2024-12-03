"use client";
import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import { fetchNftHoldings } from "@/lib/nft.helpers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export const NFTView = () => {
  const router = useRouter();
  const { network } = useNetwork();
  const { user } = useAuth();
  const NFTs = [
    {
      name: "23",
    },
    {
      name: "23",
    },
    {
      name: "23",
    },
    {
      name: "23",
    },
  ];
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        if (!user) return;
        const nfts = await fetchNftHoldings(
          user?.solPublicKey,
          network.rpcUrl || ""
        );
        console.log(nfts, "wertyuiop");
      } catch (error) {
        console.log(error);
      }
    };
    fetchNFTs();
  }, [user]);
  return (
    <div className=" w-[100%] h-[100%]">
      <div className=" bg-slate-50/0 mb-[10px] w-[100%] flex py-3 px-2 ">
        <div
          onClick={() => router.back()}
          className="bg-white/5 flex items-center justify-center w-11 rounded-full ml-1 mr-auto h-10"
        >
          <ArrowLeft className="font-bold text-xl" />
        </div>
        <div className="ml-auto mt-1 mr-[36%]">
          <p className="font-light text-xl">Collectibles</p>
        </div>
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-center h-auto ml-auto mr-auto rounded-lg py-4 px-3 bg-white/0 w-[98%]">
        {NFTs &&
          NFTs.map((coll, i) => (
            <div
              key={i}
              className="w-[46%] h-[160px] ml-auto mb-1 mt-1 mr-auto bg-white/10 animate-pulse rounded-xl"
            ></div>
          ))}
      </div>
      <div className="mt-10 flex items-center justify-center">
        <p className="text-2xl font-light">Coming Soon</p>
      </div>
    </div>
  );
};
