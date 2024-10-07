import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
//import { apiResponse } from "./api.helpers";
import * as bip39 from "bip39";
import bs58 from 'bs58'

interface SeedGenerationResult {
  seedArray: Uint8Array;
  mnemonic: string;
}

export const SolConverter = (value:number) => {
  const converted = value/LAMPORTS_PER_SOL
  return converted;
}

export const formatAddress = (value:string) => {
  return value.substring(0, 7) + "......" + value.substring(value.length - 2);
};


export const getKeypair = async (userMnemonic: string) => {
  try {
   const seed = await bip39.mnemonicToSeed(userMnemonic);
   //console.log(seed,'seed')
   const seedBytes = seed.slice(0, 32);
   const account = await Keypair.fromSeed(seedBytes);
   return account as Keypair
  } catch (error) {
     console.log(error,'keypayr get error')
  }
 }

 
export const getKeypairFromPrivateKey = (privateKeyString: string):Keypair => {
  // If the private key is in base58 format, decode it
  const privateKeyBytes = bs58.decode(privateKeyString);
  return Keypair.fromSecretKey(privateKeyBytes);
}
export const GenerateSeed = async (): Promise<SeedGenerationResult> => {
  try {
    const mnemonic = bip39.generateMnemonic();
    console.log("Mnemonic:", mnemonic);

    const seed = await bip39.mnemonicToSeed(mnemonic);
    const seedBytes = seed.slice(0, 32);

    // Convert Buffer to Uint8Array
    const seedArray = new Uint8Array(seedBytes);

    console.log("Seed (Uint8Array):", seedArray);
    return { seedArray, mnemonic };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error generating seed:", error.message);
    }
    throw error;
  }
};



// The improved getTokenPrice function
export const getTokenPrice = async (tokenId: string): Promise<number> => {
  try {
    const baseUrl = "https://api.coingecko.com/api/v3/simple/price";
    const response = await axios.get(`${baseUrl}?ids=${tokenId}&vs_currencies=usd`);
    
    const price = response.data[tokenId]?.usd;
    
    if (typeof price !== 'number') {
      throw new Error('Invalid price data received');
    }
    
    return price;
  } catch (error) {
    //console.error('Error fetching token price:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

export const getSolPrice = async (tokenId: string): Promise<number> => {
  try {
    const baseUrl = "https://api.coingecko.com/api/v3/simple/price";
    const response = await axios.get(`${baseUrl}?ids=${tokenId}&vs_currencies=usd`);
    
    const price = response.data[tokenId]?.usd;
    
    if (typeof price !== 'number') {
      throw new Error('Invalid sol price data received');
    }
    
    return price;
  } catch (error) {
    //console.error('Error fetching token price:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

// New function to get prices for multiple tokens
export const getTokenPrices = async (tokenIds: string[]): Promise<Map<string, number>> => {
  const tokenPrices = new Map<string, number>();

  try {
    // Use Promise.all to fetch all prices concurrently
    const prices = await Promise.all(tokenIds.map(getTokenPrice));

    // Populate the map with the results
    tokenIds.forEach((tokenId, index) => {
      tokenPrices.set(tokenId, prices[index]);
    });

    return tokenPrices;
  } catch (error) {
    //console.error('Error fetching token prices:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};
