"use client";
import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import { formatNFT } from "@/lib/helper.lib";
//import { fetchNftHoldings } from "@/lib/nft.helpers";
import {
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey, Umi } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
//import { url } from "inspector";
//import { toBigInt } from "ethers";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  isNft: boolean;
  collection: string;
  isCollectionNft: boolean;
  isCollectionMaster: boolean;
}
interface TokenList extends Array<TokenInfo> {}

interface GroupedNfts {
  [collectionKey: string]: TokenInfo[];
}

export const NFTView = () => {
  const router = useRouter();
  const { network } = useNetwork();
  const connection = new Connection(network?.rpcUrl || "", {
    commitment: "confirmed",
  });

  const [nfts, setNfts] = useState<TokenList | null>(null);

  async function umiSwitchToSoonDevnet(umi: Umi) {
    umi.programs.add(
      {
        name: "mplTokenMetadata",
        publicKey: publicKey("6C4GR9AtMGF25sjXKtdB7A6NVQUudEQWw97kG61pGuA1"),
        getErrorFromCode: () => null,
        getErrorFromName: () => null,
        isOnCluster: () => true,
      },
      true
    );
  }
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserTokens() {
      if (!user) return;

      try {
        let pubKey: PublicKey;
        try {
          pubKey = new PublicKey(user?.solPublicKey || "");
        } catch (error) {
          throw new Error(
            `Invalid Solana address: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          pubKey,
          { programId: TOKEN_PROGRAM_ID }
        );

        const tokenInfos = await Promise.all(
          tokenAccounts.value
            .filter(
              (account) =>
                Number(account.account.data.parsed.info.tokenAmount.amount) > 0
            )
            .filter(
              (acc) =>
                Number(acc.account.data.parsed.info.tokenAmount.amount) === 1 &&
                acc.account.data.parsed.info.tokenAmount.decimals === 0
            )
            .map(async (account) => {
              const mintAddress = account.account.data.parsed.info.mint;
              const amount =
                Number(account.account.data.parsed.info.tokenAmount.amount) /
                Math.pow(
                  10,
                  account.account.data.parsed.info.tokenAmount.decimals
                );
              try {
                const umi = createUmi(network?.rpcUrl || "").use(
                  mplTokenMetadata()
                );
                await umiSwitchToSoonDevnet(umi);

                const asset = await fetchDigitalAsset(
                  umi,
                  publicKey(mintAddress)
                );
                let imageUrl = "";
                const isNft =
                  Number(asset.mint.supply) === 1 && asset.mint.decimals === 0;

                let collection = "uncategorized";

                let isCollectionNft = false;
                let isCollectionMaster = false;

                if (
                  asset.metadata.collectionDetails &&
                  "some" in asset.metadata.tokenStandard &&
                  asset.metadata.tokenStandard.some === "NonFungible"
                ) {
                  isCollectionMaster = true;
                  collection = mintAddress;
                } else if (asset.metadata.collection) {
                  type CollectionOption = {
                    __option: "Some";
                    value: {
                      key: { toString: () => string };
                      verified: boolean;
                    };
                  };

                  const collectionData = asset.metadata
                    .collection as unknown as CollectionOption;

                  if (
                    collectionData.__option === "Some" &&
                    collectionData.value &&
                    collectionData.value.verified
                  ) {
                    collection = collectionData.value.key.toString();
                    isCollectionNft = true;
                  }
                }

                if (asset.metadata.uri) {
                  const response = await fetch(asset.metadata.uri);
                  const jsonMetadata = await response.json();
                  imageUrl = jsonMetadata.image || "";
                }

                return {
                  address: mintAddress,
                  symbol: asset.metadata.symbol,
                  name: asset.metadata.name,
                  image: imageUrl,
                  amount: amount,
                  isNft,
                  collection,
                  isCollectionNft,
                  isCollectionMaster,
                };
              } catch (err) {
                console.error("Error fetching token info:", err);
                return {
                  address: mintAddress,
                  symbol: "Unknown",
                  name: "Unknown Token",
                  image: "",
                  amount: amount,
                  isNft: false,
                  collection: "uncategorized",
                  isCollectionNft: false,
                  isCollectionMaster: false,
                };
              }
            })
        );

        tokenInfos.reduce((acc: GroupedNfts, token) => {
          if (token.isNft) {
            let collectionKey;

            if (token.isCollectionMaster) {
              collectionKey = token.address;
            } else if (token.isCollectionNft) {
              collectionKey = token.collection;
            } else {
              collectionKey = "uncategorized";
            }

            if (!acc[collectionKey]) {
              acc[collectionKey] = [];
            }
            acc[collectionKey].push(token);
          }
          return acc;
        }, {});

        setNfts(tokenInfos);
      } catch (err) {
        console.error("Error fetching tokens:", err);
      } finally {
      }
    }

    fetchUserTokens();
  }, []);

  return (
    <div className=" w-[100%] h-[100%] ">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => router.back()} className="flex items-center">
          <ChevronLeft className="w-6 h-6 mr-4" />
          <h1 className="text-xl font-medium">Collectibles</h1>
        </button>
      </div>
      <div className="mt-1 grid grid-cols-2 items-center justify-between  h-auto ml-auto mr-auto rounded-lg py-4 px-4 bg-white/0 w-[100%]">
        {nfts !== null && nfts?.length > 0 ? (
          nfts.map((coll, i) => (
            <div
              key={i}
              style={{
                backgroundImage: `url(${coll.image})`,
              }}
              className="w-[90%] h-[180px] ml-auto mb-1 mt-1 px-3 cursor-pointer mr-auto bg-white/10 bg-cover bg-center bg-no-repeat rounded-xl"
            >
              <div className="w-auto h-7 text-sm bg-black/20 ml-auto mr-auto px-3 mt-[90%]  flex items-center justify-center rounded-lg">
                <p className="py-1 px-2">
                  {coll.name.length < 6 ? coll.name : formatNFT(coll.name)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-[260px] grid-cols-1 ml-auto mb-1 mt-1 mr-auto bg-white/0 rounded-xl">
            You dont Have any Collectible
          </div>
        )}
      </div>
    </div>
  );
};
