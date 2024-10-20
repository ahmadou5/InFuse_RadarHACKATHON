import {
  Rpc,
  SignatureWithMetadata,
  WithCursor,
  createRpc,
  bn,
} from "@lightprotocol/stateless.js";
import * as bip39 from "bip39";
import {
  createMint,
  mintTo,
  CompressedTokenProgram,
  selectMinCompressedTokenAccountsForTransfer,
} from "@lightprotocol/compressed-token";
import { createAssociatedTokenAccount } from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  PublicKeyData,
  Transaction,
  sendAndConfirmTransaction
  //clusterApiUrl,
} from "@solana/web3.js";
import { getKeypairFromPrivateKey } from "./helper.lib";
import { ENV } from "./constant/env.constant";
import { apiResponse } from "./api.helpers";


/// Helius exposes Solana and compression RPC endpoints through a single URL
const RPC_ENDPOINT = ENV.RPC
const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);
const MINT_KEYPAIR = Keypair.generate();
const mint = MINT_KEYPAIR.publicKey;

//Decompress token Function...............

export const decompressToken = async ({
  splAddress,
  amount,
  userAddress,
}: {
  splAddress: PublicKeyData;
  amount: number;
  userAddress: PublicKeyData;
}) => {
  try {
    const account = getKeypairFromPrivateKey(userAddress.toString());
    const tokenAddress = new PublicKey(splAddress);
    const ata = await createAssociatedTokenAccount(
      connection,
      account,
      tokenAddress,
      account.publicKey
    );

    // 1. Fetch the latest compressed token account state
    const compressedTokenAccounts =
      await connection.getCompressedTokenAccountsByOwner(account.publicKey, {
        mint,
      });

    // 2. Select accounts to transfer from based on the transfer amount
    const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
      compressedTokenAccounts.items,
      amount
    );

    // 3. Fetch recent validity proof
    const proof = await connection.getValidityProof(
      inputAccounts.map((account) => bn(account.compressedAccount.hash))
    );

    // 4. Create the decompress instruction
    const decompressIx = await CompressedTokenProgram.decompress({
      payer: account.publicKey,
      inputCompressedTokenAccounts: inputAccounts,
      toAddress: ata,
      amount,
      recentInputStateRootIndices: proof.rootIndices,
      recentValidityProof: proof.compressedProof,
    });
    console.log(decompressIx);

  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
};

// Compressionn function...................
export const compressToken = async ({
  userMnemonic,
  owner,
  splAddress,
  amount,
}: {
  userMnemonic: string;
  owner: PublicKeyData;
  splAddress: PublicKeyData;
  amount: number;
}) => {
  try {
    const seed = await bip39.mnemonicToSeed(userMnemonic);
    //console.log(seed,'seed')
    const seedBytes = seed.slice(0, 32);
    const account = await Keypair.fromSeed(seedBytes);
    //const account = getKeypairFromPrivateKey(userAddress.toString())
    const tokenAddress = new PublicKey(splAddress);
    const tokenAuth = new PublicKey(owner);
    console.log("mun wuce0");
    //const instructions = []


console.log('mun wuce2')
  // 1. Fetch the latest compressed token account state
  const compressedTokenAccounts =
      await connection.getCompressedTokenAccountsByOwner(account.publicKey, {
          mint,
      });
  console.log(compressedTokenAccounts,'all')
  const other = compressedTokenAccounts.items

  console.log(other,'all other')
  // 2. Select accounts to transfer from based on the transfer amount
  const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
      other,
      amount,
  );

  // 3. Fetch recent validity proof
  const proof = await connection.getValidityProof(
      inputAccounts.map(account => bn(account.compressedAccount.hash)),
  );
    
    // 4. Create the decompress instruction
    const decompressTx = await CompressedTokenProgram.decompress({
      payer: account.publicKey,
      inputCompressedTokenAccounts: inputAccounts,
      toAddress: account.publicKey,
      amount,
      recentInputStateRootIndices: proof.rootIndices,
      recentValidityProof: proof.compressedProof,
  });

  console.log(decompressTx,'gdggdgdgdgdg')

  // 5. Create the compress instruction
  const compressTx = await CompressedTokenProgram.compress({
      payer: account.publicKey,
      owner: tokenAuth,
      source: account.publicKey,
      toAddress: account.publicKey,
      amount: amount,
      mint:tokenAddress
  });
    console.log("mun wuce2");
    console.log(compressTx,decompressTx, 'instructions')
    
    
    const transaction = new Transaction()
      transaction.feePayer = account.publicKey
  
      transaction.add(compressTx)
  
      // set the end user as the fee payer
      transaction.feePayer = account.publicKey
    
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash
      const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [
          account, // payer, owner
        ]
      );
        console.log(compressTx, " transaction");
    return apiResponse(true, "compressed", transactionSignature);
  } catch (error: unknown) {
    if (error instanceof Error)
      return apiResponse(false, "failed to compress", error.message);
  }
};

interface compressBalanceProps {
  Owner: PublicKeyData;
}

//get list of compress token owned by userAddress
export const getCompressTokenBalance = async ({
  address,
}: {
  address: PublicKey;
}) => {
  const balance = await connection.getCompressedTokenBalancesByOwner(address);
  console.log("done");
  return balance.items;
};

export const transferCompressedTokens = async ({
  amount,
  sender,
  receiver,
}: {
  amount: number;
  receiver: PublicKeyData;
  sender: PublicKeyData;
}) => {
  try {
    const receiverKey = new PublicKey(receiver);
    const senderKey = new PublicKey(sender);
    // get the token account state
    const compressedTokenAccounts =
      await connection.getCompressedTokenAccountsByOwner(senderKey, {
        mint,
      });

    // 2. Select accounts to transfer from based on the transfer amount
    const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
      compressedTokenAccounts.items,
      amount
    );

    // 3. Fetch recent validity proof
    const proof = await connection.getValidityProof(
      inputAccounts.map((account) => bn(account.compressedAccount.hash))
    );

    // 4. Create transfer instruction
    const ix = await CompressedTokenProgram.transfer({
      payer: senderKey,
      inputCompressedTokenAccounts: inputAccounts,
      toAddress: receiverKey,
      amount: amount,
      recentInputStateRootIndices: proof.rootIndices,
      recentValidityProof: proof.compressedProof,
    });

    console.log(ix);
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
};

// get list of history of users compressed tokens trx
export const getCompressTokenHistory = async ({
  Owner,
}: compressBalanceProps) => {
  const key = new PublicKey(Owner);
  const signatures: WithCursor<SignatureWithMetadata[]> =
    await connection.getCompressionSignaturesForOwner(key);
  console.log(signatures);

  const parsedTransaction = await connection.getTransactionWithCompressionInfo(
    signatures.items[0].signature
  );
  console.log(parsedTransaction);
  return { signatures, parsedTransaction };
};

export async function fetchCompressedTokens(address: string) {
  // Connect to Solana mainnet

  // Convert address string to PublicKey
  const publicKey = new PublicKey(address);

  try {
    // Fetch compressed token accounts
    const tokenAccounts =
      connection.getCompressedTokenAccountsByOwner(publicKey);

    // Log the results
    console.log("Compressed Tokens:", tokenAccounts);
    return tokenAccounts;
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("Error fetching compressed tokens:", error.message);
    throw error;
  }
}

// test minnt functions
export const testMint = async (mnemonic: string | undefined) => {
  //console.log('started',mnemonic)
  if (mnemonic === undefined) return;
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const seedBytes = seed.slice(0, 32);
  const account = Keypair.fromSeed(seedBytes);
  try {
    console.log('passed')
    const { mint, transactionSignature } = await createMint(
      connection,
      account,
      account.publicKey,
      9,
      
    );
    console.log(`create-mint success! txId: ${transactionSignature}`);

    const mintToTxId = await mintTo(
      connection,
      account,
      mint,
      account.publicKey,
      account,
      500e9
    );
    

    console.log(`mint-to success! txId: ${mintToTxId}`);
  } catch (error) {
    if (error instanceof Error) console.log('error',error.message,'message');
  }
};
