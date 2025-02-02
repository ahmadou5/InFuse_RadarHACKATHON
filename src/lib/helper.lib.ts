import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

import axios, { AxiosError } from "axios";
//import { apiResponse } from "./api.helpers";
import { Tokens } from "@/interfaces/models.interface";
import * as bip39 from "bip39";
import bs58 from "bs58";
import { ethers } from "ethers";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export interface SeedGenerationResult {
  seedArray: Uint8Array;
  mnemonic: string;
}

export const SolConverter = (value: number) => {
  const converted = value / LAMPORTS_PER_SOL;
  return converted;
};

export const CreateAllAccounts = async ({
  mnemonic,
  seedArray,
}: {
  mnemonic: string;
  seedArray: Uint8Array;
}) => {
  //solana
  const solanaAccount = Keypair.fromSeed(seedArray);
  const solPublicKey = solanaAccount.publicKey.toString();
  const solPrivateKey = solanaAccount.secretKey;
  const SolConvertedsecret = bs58.encode(solPrivateKey);

  //eth addresses
  const ethAccount = ethers.Wallet.fromPhrase(mnemonic);
  const Ethaddress = ethAccount.address;
  const EthprivateKey = ethAccount.privateKey;

  // sui Account
  const Suiaccount = Ed25519Keypair.deriveKeypair(mnemonic);

  const suiPublicKey = Suiaccount.getPublicKey();
  const suiPrivateKey = Suiaccount.getSecretKey();
  const suiAddress = Suiaccount.toSuiAddress();

  if (!solanaAccount && !ethAccount && !Suiaccount) return;

  return {
    solPublicKey,
    SolConvertedsecret,
    solPrivateKey,
    Ethaddress,
    EthprivateKey,
    suiAddress,
    suiPrivateKey,
    suiPublicKey,
  };
};

export const formatAddress = (value: string) => {
  return value.substring(0, 7) + "......" + value.substring(value.length - 2);
};

export const formatNFT = (value: string) => {
  return value.substring(0, 4) + "......" + value.substring(value.length - 2);
};

export const formatEmail = (value: string) => {
  return value.substring(0, 4) + "...." + value.substring(value.length - 10);
};

export const getKeypairFromPrivateKey = (privateKeyString: string): Keypair => {
  // If the private key is in base58 format, decode it
  const privateKeyBytes = bs58.decode(privateKeyString);
  return Keypair.fromSecretKey(privateKeyBytes);
};

export const GenerateSeed = async (): Promise<SeedGenerationResult> => {
  try {
    const mnemonic = bip39.generateMnemonic();

    const seed = await bip39.mnemonicToSeed(mnemonic);
    const seedBytes = seed.slice(0, 32);

    // Convert Buffer to Uint8Array
    const seedArray = new Uint8Array(seedBytes);
    return { seedArray, mnemonic };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error generating seed:", error.message);
    }
    throw error;
  }
};

interface WalletTotals {
  totalValue: number;
  solValue: number;
  tokenValue: number;
}

export const calculateWalletTotals = (
  solBalance: number | undefined,
  solPrice: number | undefined,
  tokenBalances: { [address: string]: number },
  tokenPrices: { [ticker: string]: number },
  tokens: Tokens[]
): WalletTotals => {
  // Calculate SOL va
  // Calculate SOL value
  const solValue = (solBalance ?? 0) * (solPrice ?? 0);

  // Calculate token values
  const tokenValue = tokens.reduce((total, token) => {
    const balance = tokenBalances[token.address] ?? 0;
    const price = tokenPrices[token.token_id] ?? 0;
    return total + balance * price;
  }, 0);

  // Calculate total value
  const totalValue = solValue + tokenValue;

  return {
    totalValue,
    solValue,
    tokenValue,
  };
};

// The improved getTokenPrice function
export const getTokenPrice = async (tokenId: string): Promise<number> => {
  try {
    const baseUrl = "https://api.coingecko.com/api/v3/simple/price";
    const response = await axios.get(
      `${baseUrl}?ids=${tokenId}&vs_currencies=usd`
    );

    const price = response.data[tokenId]?.usd;

    if (typeof price !== "number") {
      throw new Error("Invalid price data received");
    }

    return price;
  } catch (error) {
    //console.error('Error fetching token price:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};
// https://api.coingecko.com/api/v3/simple/price?ids=bonk&vs_currencies=usd
// New function to get prices for multiple tokens

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 4,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s
      await delay(delayMs * Math.pow(2, attempt - 1));
    }
  }

  throw new Error(
    `Operation failed after ${maxRetries} attempts. Last error: ${
      lastError instanceof Error ? lastError.message : "Unknown error"
    }`
  );
}

export const getNativePrice = async (tokenId: string): Promise<number> => {
  const baseUrl = "https://api.coingecko.com/api/v3/simple/price";

  try {
    const price = await retryOperation(async () => {
      const response = await axios.get(
        `${baseUrl}?ids=${tokenId}&vs_currencies=usd`
      );

      const price = response.data[tokenId]?.usd;

      if (typeof price !== "number") {
        throw new Error(`Invalid price data received for token ${tokenId}`);
      }

      return price;
    });

    return price;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle specific API errors
      if (error.response?.status === 404) {
        throw new Error(`Token ${tokenId} not found on CoinGecko`);
      }
      if (error.response?.status === 429) {
        throw new Error(
          "CoinGecko API rate limit exceeded. Please try again later."
        );
      }
      throw new Error(`CoinGecko API error: ${error.message}`);
    }

    throw error;
  }
};

export const getTokenPricesV2 = async (
  tokenIds: string[]
): Promise<Map<string, number>> => {
  const tokenPrices = new Map<string, number>();

  try {
    // Create an array of promises that will retry individually
    const pricePromises = tokenIds.map((tokenId) =>
      retryOperation(async () => {
        const price = await getTokenPrice(tokenId);
        return { tokenId, price };
      })
    );

    // Wait for all prices to be fetched with retries
    const results = await Promise.all(pricePromises);

    // Populate the map with the results
    results.forEach(({ tokenId, price }) => {
      tokenPrices.set(tokenId, price);
    });

    return tokenPrices;
  } catch (error) {
    throw new Error(
      `Failed to fetch token prices: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
