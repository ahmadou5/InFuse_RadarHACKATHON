import axios from 'axios'
import { apiResponse } from './api.helpers';
import * as bip39 from 'bip39';

interface SeedGenerationResult {
  seedArray: Uint8Array;
  mnemonic: string;
}

export const GenerateSeed = async (): Promise<SeedGenerationResult> => {
  try {
    const mnemonic = bip39.generateMnemonic();
    console.log('Mnemonic:', mnemonic);

    const seed = await bip39.mnemonicToSeed(mnemonic);
    const seedBytes = seed.slice(0, 32);
    
    // Convert Buffer to Uint8Array
    const seedArray = new Uint8Array(seedBytes);
    
    console.log('Seed (Uint8Array):', seedArray);
    return { seedArray, mnemonic };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating seed:', error.message);
    }
    throw error;
  }
};

export const GetTokenPrice = async (tokenId:string) => {
 try {
  const baseUrl = "https://api.coingecko.com/api/v3/simple/price";
  const response = await axios.get(
    `${baseUrl}?ids=${tokenId}&vs_currencies=usd`
  );
  return apiResponse(true, 'Token Price', response.data)

 } catch (error) {
  if (error instanceof Error) {
    apiResponse(false, 'Token price error', error.message)
    console.log(error.message)
  }
 
  throw error
 }
}