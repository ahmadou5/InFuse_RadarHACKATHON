import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { GenerateSeed } from "./helper.lib";

export const createSuiWallet = async () => {
  const { mnemonic } = await GenerateSeed();
  const account = Ed25519Keypair.deriveKeypair(mnemonic);

  const publicKey = account.getPublicKey();
  const privateKey = account.getSecretKey();
  const address = account.toSuiAddress();

  console.log(account.getSecretKey());
  console.log(account.toSuiAddress());
  console.log(account.getPublicKey());
  return {
    publicKey,
    privateKey,
    address,
  };
};
