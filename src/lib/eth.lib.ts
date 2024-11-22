import { ethers } from "ethers";
import { GenerateSeed } from "./helper.lib";

export const createEthAccount = async () => {
  const { mnemonic } = await GenerateSeed();
  const account = ethers.Wallet.fromPhrase(mnemonic);
  const address = account.address;
  const privateKey = account.privateKey;

  console.log(address, privateKey);
  return {
    address,
    privateKey,
  };
};
