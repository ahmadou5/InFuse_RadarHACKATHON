import {
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { TokenTransactionError } from "./spl.lib";

interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
}

export async function fetchUserAssets(
  address: string,
  rpcUrl: string
): Promise<TokenInfo[]> {
  try {
    const connection = new Connection(
      rpcUrl || "https://api.mainnet-beta.solana.com",
      "confirmed"
    );
    let pubKey: PublicKey;
    try {
      pubKey = new PublicKey("6RQtHXKpniz7g56iYi4nxGorwRGs7j2ASxTRgRC1rYqA");
    } catch (error) {
      throw new TokenTransactionError(
        `Invalid Solana address: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
    // Fetch token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      pubKey,
      { programId: TOKEN_PROGRAM_ID }
    );
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
            //await umiSwitchToSoonDevnet(umi);

            // Fetch digital asset
            let asset;
            try {
              asset = await fetchDigitalAsset(umi, publicKey(mintAddress));
            } catch (error) {
              if (error instanceof Error) {
                if (error.message.includes("AccountNotFoundError")) {
                  console.error(
                    `Metadata account not found for mint address: ${mintAddress}`
                  );
                  return {
                    address: mintAddress,
                    symbol: "Unknown",
                    name: "Unknown Token",
                    image: "",
                    amount: amount,
                  };
                }
                throw error;
              }
            }
            if (!asset) {
              console.error(`Asset not found for mint address: ${mintAddress}`);
              return {
                address: mintAddress,
                symbol: "Unknown",
                name: "Unknown Token",
                image: "",
                amount: amount,
              };
            }

            let imageUrl = "";

            if (!asset) {
              throw new Error("Asset not found");
            }
            console.log("asset", asset);
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
            };
          } catch (err) {
            console.error("Error fetching token info:", err);
            return {
              address: mintAddress,
              symbol: "Unknown",
              name: "Unknown Token",
              image: "",
              amount: amount,
            };
          }
        })
    );
    // Filter and return only NFTs
    return nftInfos;
  } catch (err) {
    console.error("Error fetching NFT holdings:", err);
    return [];
  }
}
// Define a comprehensive metadata interface that satisfies type requirements
