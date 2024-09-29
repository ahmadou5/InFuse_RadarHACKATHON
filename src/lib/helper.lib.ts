import axios from "axios";
//import { apiResponse } from "./api.helpers";
import * as bip39 from "bip39";

interface SeedGenerationResult {
  seedArray: Uint8Array;
  mnemonic: string;
}

export const formatAddress = (value:string) => {
  return value.substring(0, 10) + "..." + value.substring(value.length - 3);
};

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
    console.error('Error fetching token price:', error instanceof Error ? error.message : 'Unknown error');
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
    console.error('Error fetching token prices:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};
