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
  ParsedAccountData,
  PublicKey,
  PublicKeyData,
  Transaction,
  sendAndConfirmTransaction,
  //clusterApiUrl,
} from "@solana/web3.js";
import { getKeypairFromPrivateKey } from "./helper.lib";
import { ENV } from "./constant/env.constant";
import { apiResponse } from "./api.helpers";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

/// Helius exposes Solana and compression RPC endpoints through a single URL
const RPC_ENDPOINT = ENV.RPC;
const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);
const MINT_KEYPAIR = Keypair.generate();
const mint = MINT_KEYPAIR.publicKey;

async function getTokenDecimals(mintAddress: PublicKey): Promise<number> {
  const info = await connection.getParsedAccountInfo(mintAddress);
  const result = (info.value?.data as ParsedAccountData).parsed.info
    .decimals as number;
  return result;
}
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
    const tokenDecimal = getTokenDecimals(tokenAddress);
    // 1. Fetch the latest compressed token account state
    console.log(tokenDecimal);
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
    console.log(owner, "seed");
    const seedBytes = seed.slice(0, 32);
    const account = await Keypair.fromSeed(seedBytes);
    //const account = getKeypairFromPrivateKey(userAddress.toString())
    const tokenAddress = new PublicKey(splAddress);
    //const tokenAuth = new PublicKey(owner);
    const tokenDecimal = await getTokenDecimals(tokenAddress);
    let transferAmount = parseFloat(amount.toString());
    transferAmount = parseInt(transferAmount.toFixed(tokenDecimal));
    transferAmount = transferAmount * Math.pow(10, tokenDecimal);
    console.log("mun wuce0");
    //const instructions = [];
    // 0. Create an associated token account for the user if it doesn't exist
    console.log("before ata");
    const ata = await getAssociatedTokenAddress(
      tokenAddress,
      account.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const ifexists = await connection.getAccountInfo(ata);

    const instructions = [];

    if (!ifexists || !ifexists.data) {
      const createATAiX = createAssociatedTokenAccountInstruction(
        account.publicKey,
        ata,
        account.publicKey,
        tokenAddress,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      instructions.push(createATAiX);
    }

    //instructions.push(ata)
    // 0. Create an associated token account for the user if it doesn't exist
    console.log(ata.toString(), "ata");
    // 1. Fetch the latest compressed token account state

    // 2. Select accounts to transfer from based on the transfer amount

    //console.log("mun wuce2", proof);
    // 1. Fetch the latest compressed token account state
    //const instructions = [];
    // 4. Create the decompress instruction

    //instructions.push(decompressTx);
    //console.log(decompressTx, "gdggdgdgdgdg");
    const TokenPool = await CompressedTokenProgram.createTokenPool({
      mint: tokenAddress,
      feePayer: account.publicKey,
    });
    if (!TokenPool.programId) {
      instructions.push(TokenPool);
    } else {
    }

    // 5. Create the compress instruction
    const compressTx = await CompressedTokenProgram.compress({
      payer: account.publicKey,
      owner: account.publicKey,
      source: ata,
      toAddress: account.publicKey,
      amount: transferAmount,
      mint: tokenAddress,
    });
    console.log("mun wuce2");
    console.log(compressTx, "instructions");
    instructions.push(compressTx);
    const transaction = new Transaction();
    transaction.feePayer = account.publicKey;

    transaction.add(...instructions);

    // set the end user as the fee payer
    transaction.feePayer = account.publicKey;
    console.log(transaction.signatures);
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
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
    console.log("passed");
    const { mint, transactionSignature } = await createMint(
      connection,
      account,
      account.publicKey,
      9
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
    if (error instanceof Error) console.log("error", error.message, "message");
  }
};
