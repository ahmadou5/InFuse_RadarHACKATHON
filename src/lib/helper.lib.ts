import bip39 from 'bip39';

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

