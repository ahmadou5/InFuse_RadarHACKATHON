import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { mnemonicToPrivateKey } from 'ton-crypto';

export const createTonAccount = async (mnemonic: string) => {
  const keyPair = await mnemonicToPrivateKey(mnemonic.split('-'));
  const tonPublicKey = keyPair.publicKey;
  const tonPrivateKey = keyPair.secretKey;
  const secret = bs58.encode(tonPrivateKey);
  const public1 = bs58.encode(tonPublicKey);

  return {
    secret,
    public1,
  };
};
