import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex, Nft, Sft } from "@metaplex-foundation/js";

// Define a comprehensive metadata interface that satisfies type requirements
interface Metadata {
  name: string;
  symbol: string;
  uri: string;
  mintAddress: string;
  owner: string;
  image?: string;
  description?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export async function fetchWalletNFTs(
  connection2: string,
  walletAddress: string | PublicKey
): Promise<Metadata[]> {
  try {
    const connection = new Connection(
      connection2 || "https://api.mainnet-beta.solana.com",
      "confirmed"
    );

    // Create a public key from the wallet address
    const wallet = new PublicKey(walletAddress);

    // Initialize Metaplex
    const metaplex = Metaplex.make(connection);

    // Fetch all NFTs owned by the wallet
    const nfts = await metaplex.nfts().findAllByOwner({ owner: wallet });

    // Fetch full metadata for each NFT
    const nftMetadata: Metadata[] = [];

    for (const nft of nfts) {
      // Fetch the complete NFT data
      const fullNftData = await metaplex.nfts().findByMint({
        mintAddress: nft.address,
      });

      // Type guard to handle both Nft and Sft
      const isNftOrSft = (item: Nft | Sft): item is Nft | Sft => {
        return item !== null && typeof item === "object";
      };

      // Ensure the item is a valid NFT or SFT
      if (isNftOrSft(fullNftData)) {
        // Create metadata with explicit type casting
        const metadata: Metadata = {
          name: fullNftData.name,
          symbol: fullNftData.symbol,
          uri: fullNftData.uri,
          mintAddress: fullNftData.address.toBase58(),
          owner: wallet.toBase58(),
          image: fullNftData.json?.image,
          description: fullNftData.json?.description,
          //attributes: fullNftData.json?.attributes,
        };

        nftMetadata.push(metadata);
      }
    }

    return nftMetadata;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
}
