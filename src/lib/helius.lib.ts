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

// Types for API Configuration
interface HeliusApiConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

// Helius API Response Types
interface HeliusTokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  mint: string;
  tokenName?: string;
  tokenSymbol?: string;
  decimals: number;
  tokenAmount: string;
}

interface HeliusNativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

interface HeliusTransaction {
  signature: string;
  timestamp: number;
  slot: number;
  status: "success" | "failed";
  fee: number;
  feePayer: string;
  tokenTransfers?: HeliusTokenTransfer[];
  nativeTransfers?: HeliusNativeTransfer[];
}

// Common Types
interface TransferBase {
  signature: string;
  timestamp: number;
  slot: number;
  status: "success" | "failed";
  fee: number;
  feePayer: string;
}

// SPL Transfer Types
interface SplTransfer extends TransferBase {
  type: "SPL_TRANSFER";
  mint: string;
  tokenName?: string;
  tokenSymbol?: string;
  decimals: number;
  fromAddress: string;
  toAddress: string;
  amount: number;
  rawAmount: string;
}

// Native SOL Transfer Types
interface NativeTransfer extends TransferBase {
  type: "NATIVE_TRANSFER";
  fromAddress: string;
  toAddress: string;
  amount: number; // in SOL
  rawLamports: number;
}

// Response Types
interface TransferHistoryResponse<T> {
  success: boolean;
  transfers: T[];
  error?: string;
  pagination?: {
    hasMore: boolean;
    lastSignature?: string;
  };
}

interface TransferOptions {
  limit?: number;
  before?: string;
  until?: string;
  maxRetries?: number;
}

// Create Helius API client
const createHeliusClient = (config: HeliusApiConfig) => {
  const baseURL = config.baseUrl || "https://api.helius.xyz/v0";

  return axios.create({
    baseURL,
    timeout: config.timeout || 30000,
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * Get SPL token transfer history for an address
 * @param address - Solana wallet address
 * @param config - Helius API configuration
 * @param options - Query options
 * @returns SPL transfer history
 */
export async function getSplTransferHistory(
  address: string,

  options: TransferOptions = {}
): Promise<TransferHistoryResponse<SplTransfer>> {
  try {
    const client = createHeliusClient({
      baseUrl: "https://api.helius.xyz/v0",
      timeout: 3000,
      apiKey: ENV.HELIUS_API_KEY || "",
    });

    const response = await client.post<HeliusTransaction[]>(
      `/addresses/${address}/transactions`,
      {
        query: {
          types: ["TOKEN_TRANSFER"],
          sourceAddress: address,
          "api-key": ENV.HELIUS_API_KEY,
        },
        options: {
          limit: options.limit || 100,
          before: options.before,
          until: options.until,
        },
      }
    );

    // Process and format the transactions into SPL transfers
    const splTransfers: SplTransfer[] = response.data
      .filter(
        (
          tx: HeliusTransaction
        ): tx is HeliusTransaction & {
          tokenTransfers: HeliusTokenTransfer[];
        } => tx.tokenTransfers !== undefined && tx.tokenTransfers.length > 0
      )
      .flatMap((tx) =>
        tx.tokenTransfers.map(
          (transfer): SplTransfer => ({
            type: "SPL_TRANSFER",
            signature: tx.signature,
            timestamp: tx.timestamp * 1000,
            slot: tx.slot,
            status: tx.status,
            fee: tx.fee,
            feePayer: tx.feePayer,
            mint: transfer.mint,
            tokenName: transfer.tokenName,
            tokenSymbol: transfer.tokenSymbol,
            decimals: transfer.decimals,
            fromAddress: transfer.fromUserAccount,
            toAddress: transfer.toUserAccount,
            amount:
              Number(transfer.tokenAmount) / Math.pow(10, transfer.decimals),
            rawAmount: transfer.tokenAmount,
          })
        )
      );

    const lastTx = response.data[response.data.length - 1];

    return {
      success: true,
      transfers: splTransfers,
      pagination: {
        hasMore: response.data.length === (options.limit || 100),
        lastSignature: lastTx?.signature,
      },
    };
  } catch (error) {
    return handleApiError<SplTransfer>(error);
  }
}

/**
 * Get native SOL transfer history for an address
 * @param address - Solana wallet address
 * @param config - Helius API configuration
 * @param options - Query options
 * @returns Native SOL transfer history
 */
export async function getNativeTransferHistory(
  address: string,
  options: TransferOptions = {}
): Promise<TransferHistoryResponse<NativeTransfer>> {
  try {
    const client = createHeliusClient({
      baseUrl: "https://api.helius.xyz/v0",
      timeout: 3000,
      apiKey: ENV.HELIUS_API_KEY || "",
    });

    const response = await client.post<HeliusTransaction[]>(
      `/addresses/${address}/transactions`,
      {
        query: {
          types: ["SOL_TRANSFER"],
          sourceAddress: address,
          "api-key": ENV.HELIUS_API_KEY,
        },
        options: {
          limit: options.limit || 100,
          before: options.before,
          until: options.until,
        },
      }
    );

    // Process and format the transactions into native transfers
    const nativeTransfers: NativeTransfer[] = response.data
      .filter(
        (
          tx: HeliusTransaction
        ): tx is HeliusTransaction & {
          nativeTransfers: HeliusNativeTransfer[];
        } => tx.nativeTransfers !== undefined && tx.nativeTransfers.length > 0
      )
      .flatMap((tx) =>
        tx.nativeTransfers.map(
          (transfer): NativeTransfer => ({
            type: "NATIVE_TRANSFER",
            signature: tx.signature,
            timestamp: tx.timestamp * 1000,
            slot: tx.slot,
            status: tx.status,
            fee: tx.fee,
            feePayer: tx.feePayer,
            fromAddress: transfer.fromUserAccount,
            toAddress: transfer.toUserAccount,
            amount: transfer.amount / 1e9,
            rawLamports: transfer.amount,
          })
        )
      );

    const lastTx = response.data[response.data.length - 1];

    return {
      success: true,
      transfers: nativeTransfers,
      pagination: {
        hasMore: response.data.length === (options.limit || 100),
        lastSignature: lastTx?.signature,
      },
    };
  } catch (error) {
    return handleApiError<NativeTransfer>(error);
  }
}

// Helper function to handle API errors
function handleApiError<T>(error: unknown): TransferHistoryResponse<T> {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      transfers: [],
      error: `API Error: ${axiosError.response?.status} - ${axiosError.message}`,
    };
  }
  return {
    success: false,
    transfers: [],
    error: error instanceof Error ? error.message : "Unknown error occurred",
  };
}

// Helper function to format SOL amount
export function formatSolAmount(lamports: number): number {
  return lamports / 1e9;
}

// Helper function to format token amount
export function formatTokenAmount(
  amount: string | number,
  decimals: number
): number {
  return Number(amount) / Math.pow(10, decimals);
}

export type {
  HeliusApiConfig,
  HeliusTransaction,
  HeliusTokenTransfer,
  HeliusNativeTransfer,
  SplTransfer,
  NativeTransfer,
  TransferHistoryResponse,
  TransferOptions,
};

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
