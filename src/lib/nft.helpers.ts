import { Connection, PublicKey as solPublicKey } from "@solana/web3.js";
//import { Metaplex, Nft, Sft } from "@metaplex-foundation/js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey, Umi } from "@metaplex-foundation/umi";

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

export async function fetchNftHoldings(
  address: string,
  rpcUrl: string = "https://rpc.devnet.soo.network/rpc"
): Promise<TokenInfo[]> {
  try {
    const connection = new Connection(
      rpcUrl || "https://api.mainnet-beta.solana.com",
      "confirmed"
    );
    const userPublicKey = new solPublicKey(address);
    console.log("started fetchinggggg");
    // Fetch token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      userPublicKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    console.log("fdfdffd", tokenAccounts);
    // Process token accounts
    const nftInfos = await Promise.all(
      tokenAccounts.value
        .filter(
          (account) =>
            Number(account.account.data.parsed.info.tokenAmount.amount) > 0
        )
        .map(async (account) => {
          const mintAddress = account.account.data.parsed.info.mint;
          const amount =
            Number(account.account.data.parsed.info.tokenAmount.amount) /
            Math.pow(10, account.account.data.parsed.info.tokenAmount.decimals);

          try {
            // Create Umi instance
            const umi = createUmi(rpcUrl).use(mplTokenMetadata());
            await umiSwitchToSoonDevnet(umi);

            // Fetch digital asset
            const asset = await fetchDigitalAsset(umi, publicKey(mintAddress));
            let imageUrl = "";
            const isNft =
              asset.metadata.uri !== "" && asset.mint.decimals === 0;

            let collection = "uncategorized";
            let isCollectionNft = false;
            let isCollectionMaster = false;

            // Determine collection details
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

            // Fetch image URL
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
    console.log(nftInfos);
    // Filter and return only NFTs
    return nftInfos.filter((token) => token.isNft);
  } catch (err) {
    console.error("Error fetching NFT holdings:", err);
    return [];
  }
}
// Define a comprehensive metadata interface that satisfies type requirements
