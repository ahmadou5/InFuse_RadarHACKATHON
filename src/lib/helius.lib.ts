import axios, { AxiosError } from "axios";
import { ENV } from "./constant/env.constant";
// Token metadata and response interfaces
interface TokenImages {
  large?: string;
  small?: string;
}

interface TokenAttribute {
  trait_type: string;
  value: string | number;
}

interface TokenCreator {
  address: string;
  share: number;
  verified?: boolean;
}

interface TokenCollection {
  name: string;
  family?: string;
  verified?: boolean;
}

interface MarketData {
  volume24h: number | null;
  volumeAll: number | null;
  floorPrice: number | null;
  listedCount: number | null;
}

interface TokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  images?: TokenImages;
  description?: string;
  attributes?: TokenAttribute[];
  collection?: TokenCollection;
  verified?: boolean;
  creators?: TokenCreator[];
  volume24h?: number;
  volumeAll?: number;
  floorPrice?: number;
  listedCount?: number;
}

interface RawTokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  address: string;
}

interface TokenBalanceResponse {
  jsonrpc: string;
  id: string;
  result: {
    tokens: RawTokenBalance[];
  };
}

interface FormattedToken {
  mint: string;
  balance: number;
  decimals: number;
  tokenAccount: string;
  actualBalance: number;
  name: string;
  symbol: string;
  image: string | null;
  description: string | null;
  attributes: TokenAttribute[];
  collection: TokenCollection | null;
  isVerified: boolean;
  creators: TokenCreator[];
  marketData: MarketData;
}

interface TokenDataResponse {
  success: boolean;
  tokens: FormattedToken[];
  raw?: {
    balances: TokenBalanceResponse;
    metadata: TokenMetadata[];
  };
  error?: string;
}

// Create axios instance with default config
const heliusApi = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetches and formats token data for a given user address using the Helius API
 * @param userAddress - The user's Solana wallet address
 * @param heliusApiKey - API key for Helius
 * @returns Formatted token data with balances and metadata
 */
export async function getUserTokensWithMetadata(
  userAddress: string
): Promise<TokenDataResponse> {
  if (!userAddress) {
    throw new Error("User address and Helius API key are required");
  }
  const heliusApiKey = ENV.HELIUS_API_KEY;
  const baseUrl = "https://api.helius.xyz/v0";

  try {
    // Fetch token balances
    const balanceResponse = await heliusApi.post<TokenBalanceResponse>(
      `${baseUrl}/token-balances?api-key=${heliusApiKey}`,
      {
        jsonrpc: "2.0",
        id: "my-id",
        method: "getTokenBalances",
        params: { ownerAddress: userAddress },
      }
    );

    const tokens = balanceResponse.data.result.tokens;

    // Get mint addresses for metadata lookup
    const mintAddresses = tokens.map((token) => token.mint);

    // Fetch metadata for all tokens
    const metadataResponse = await heliusApi.post<TokenMetadata[]>(
      `${baseUrl}/token-metadata?api-key=${heliusApiKey}`,
      { mintAccounts: mintAddresses }
    );

    const metadataData = metadataResponse.data;

    // Combine balance and metadata information
    const formattedTokens: FormattedToken[] = tokens.map((token) => {
      const metadata =
        metadataData.find((meta) => meta.mint === token.mint) ||
        ({} as TokenMetadata);

      return {
        // Balance information
        mint: token.mint,
        balance: token.amount,
        decimals: token.decimals,
        tokenAccount: token.address,
        actualBalance: token.amount / Math.pow(10, token.decimals),

        // Metadata information
        name: metadata.name || "Unknown",
        symbol: metadata.symbol || "Unknown",
        image: metadata.images?.large || metadata.images?.small || null,
        description: metadata.description || null,

        // Additional metadata
        attributes: metadata.attributes || [],
        collection: metadata.collection || null,
        isVerified: metadata.verified || false,
        creators: metadata.creators || [],

        // Market data
        marketData: {
          volume24h: metadata.volume24h || null,
          volumeAll: metadata.volumeAll || null,
          floorPrice: metadata.floorPrice || null,
          listedCount: metadata.listedCount || null,
        },
      };
    });

    return {
      success: true,
      tokens: formattedTokens,
      raw: {
        balances: balanceResponse.data,
        metadata: metadataData,
      },
    };
  } catch (error) {
    // Handle Axios errors with more detail
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: `API Error: ${axiosError.response?.status} - ${
          axiosError.response?.statusText || axiosError.message
        }`,
        tokens: [],
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      tokens: [],
    };
  }
}

// Helper function to validate addresses (optional)
export function isValidSolanaAddress(address: string): boolean {
  return /^[0-9a-zA-Z]{32,44}$/.test(address);
}

// Example usage with error handling
/*
const fetchTokens = async () => {
  try {
    const tokens = await getUserTokensWithMetadata(
      "Your_Solana_Address",
      "Your_Helius_API_Key"
    );
    
    if (tokens.success) {
      const { tokens: userTokens } = tokens;
      console.log('Tokens:', userTokens);
      
      // Access specific token data
      userTokens.forEach(token => {
        console.log(`
          Token: ${token.name}
          Balance: ${token.actualBalance}
          Symbol: ${token.symbol}
        `);
      });
    } else {
      console.error('Error:', tokens.error);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
    } else {
      console.error('Error fetching tokens:', error);
    }
  }
};
*/

export type {
  TokenImages,
  TokenAttribute,
  TokenCreator,
  TokenCollection,
  MarketData,
  TokenMetadata,
  RawTokenBalance,
  TokenBalanceResponse,
  FormattedToken,
  TokenDataResponse,
};
