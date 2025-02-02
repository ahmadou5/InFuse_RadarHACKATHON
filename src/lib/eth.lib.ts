import { ethers } from "ethers";

export const createEthAccount = async (mnemonic: string) => {
  const account = ethers.Wallet.fromPhrase(mnemonic);
  const address = account.address;
  const privateKey = account.privateKey;

  return {
    address,
    privateKey,
  };
};
