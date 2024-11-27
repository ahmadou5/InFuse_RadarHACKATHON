import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
//import { TonClient, WalletContractV4, internal } from "ton";
import { mnemonicToPrivateKey } from "ton-crypto";

export const createTonAccount = async (mnemonic: string) => {
  console.log(mnemonic);
  const keyPair = await mnemonicToPrivateKey(mnemonic.split("-"));
  const tonPublicKey = keyPair.publicKey;
  const tonPrivateKey = keyPair.secretKey;
  const secret = bs58.encode(tonPrivateKey);
  const public1 = bs58.encode(tonPublicKey);

  return {
    secret,
    public1,
  };
};
