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
  //ParsedAccountData,
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
  getMint,
  getAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

/// Helius exposes Solana and compression RPC endpoints through a single URL
const RPC_ENDPOINT = ENV.SOL_DEVNET_RPC;
const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);
const MINT_KEYPAIR = Keypair.generate();
const mint = MINT_KEYPAIR.publicKey;

//async function getTokenDecimals(mintAddress: PublicKey): Promise<number> {
//const info = await connection.getParsedAccountInfo(mintAddress);
//const result = (info.value?.data as ParsedAccountData).parsed.info
//  .decimals as number;
//return result;
//}
//Decompress token Function...............

export const decompressToken = async ({
  splAddress,
  amount,
  userAddress,
  rpc,
}: {
  splAddress: PublicKeyData;
  amount: number;
  userAddress: PublicKeyData;
  rpc: string;
}) => {
  try {
    const RPC_ENDPOINT = rpc;
    const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
    const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);
    const account = getKeypairFromPrivateKey(userAddress.toString());
    const tokenAddress = new PublicKey(splAddress);
    const ata = await createAssociatedTokenAccount(
      connection,
      account,
      tokenAddress,
      account.publicKey
    );
    // Detailed Mint Info Logging
    const mintInfo = await getMint(connection, tokenAddress);
    console.log("Token Mint Information:", {
      decimals: mintInfo.decimals,
      supply: mintInfo.supply.toString(),
    });

    const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
    console.log(`Adjusted Amount: ${adjustedAmount}`);
    // 1. Fetch the latest compressed token account state
    //console.log(tokenDecimal);
    const compressedTokenAccounts =
      await connection.getCompressedTokenAccountsByOwner(account.publicKey, {
        mint: tokenAddress,
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

    const solBalance = await connection.getBalance(account.publicKey);
    console.log("Account Balances:", {
      solBalance,
      publicKey: account.publicKey.toString(),
    });

    const instructions = [];

    // 4. Create the decompress instruction
    const decompressIx = await CompressedTokenProgram.decompress({
      payer: account.publicKey,
      inputCompressedTokenAccounts: inputAccounts,
      toAddress: ata,
      amount,
      recentInputStateRootIndices: proof.rootIndices,
      recentValidityProof: proof.compressedProof,
    });

    instructions.push(decompressIx);
    const transaction = new Transaction();
    transaction.feePayer = account.publicKey;

    transaction.add(...instructions);

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
    console.log("Latest Blockhash:", latestBlockhash.blockhash);

    const signers = [account];

    // Fee Estimation with Detailed Logging
    const fees = await transaction.getEstimatedFee(connection);
    console.log("Transaction Fee Estimation:", {
      estimatedFees: fees,
      solBalance,
    });

    if (fees === null) {
      throw new Error("Unable to estimate transaction fees");
    }

    if (solBalance < fees) {
      throw new Error(
        `Insufficient SOL for transaction fees. Required: ${fees}, Available: ${solBalance}`
      );
    }

    // Transaction Submission with Comprehensive Logging
    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers,
      {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      }
    );
    // console.log(decompressIx);
    return apiResponse(true, "Decompressed", transactionSignature);
  } catch (error) {
    if (error instanceof Error)
      return apiResponse(false, "unable to compress", error.message);
  }
};

export const compressToken = async ({
  userMnemonic,
  splAddress,
  owner,
  amount,
  rpc,
}: {
  userMnemonic: string;
  splAddress: PublicKeyData;
  owner: PublicKeyData;
  amount: number;
  rpc: string;
}) => {
  try {
    console.log("Compression Start - Input Parameters:", {
      splAddress,
      amount,
      rpc,
      owner,
    });

    const RPC_ENDPOINT = rpc;
    const connection: Rpc = createRpc(RPC_ENDPOINT, RPC_ENDPOINT);
    const seed = await bip39.mnemonicToSeed(userMnemonic);
    const seedBytes = seed.slice(0, 32);
    const account = await Keypair.fromSeed(seedBytes);

    const tokenAddress = new PublicKey(splAddress);

    // Detailed Mint Info Logging
    const mintInfo = await getMint(connection, tokenAddress);
    console.log("Token Mint Information:", {
      decimals: mintInfo.decimals,
      supply: mintInfo.supply.toString(),
    });

    const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
    console.log(`Adjusted Amount: ${adjustedAmount}`);

    // Comprehensive ATA Creation and Balance Checks
    const ata = await getAssociatedTokenAddress(
      tokenAddress,
      account.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const solBalance = await connection.getBalance(account.publicKey);
    console.log("Account Balances:", {
      solBalance,
      publicKey: account.publicKey.toString(),
    });

    // Detailed Token Account Verification
    try {
      const tokenAccount = await getAccount(connection, ata);
      console.log("Token Account Details:", {
        address: ata.toString(),
        balance: tokenAccount.amount.toString(),
        owner: tokenAccount.owner.toString(),
      });

      if (BigInt(tokenAccount.amount) < BigInt(adjustedAmount)) {
        throw new Error(
          `Insufficient token balance. Required: ${adjustedAmount}, Available: ${tokenAccount.amount}`
        );
      }
    } catch (error: unknown) {
      console.error("Token Account Retrieval Error:", error);
      if (error instanceof Error)
        throw new Error(`Token account error: ${error.message}`);
    }

    const instructions = [];

    // ATA Existence and Creation Logic with Detailed Logging
    const ifexists = await connection.getAccountInfo(ata);
    if (!ifexists || !ifexists.data) {
      console.log("ATA Does Not Exist - Attempting Creation");
      const rent = await connection.getMinimumBalanceForRentExemption(165);

      if (solBalance < rent) {
        throw new Error(
          `Insufficient SOL for ATA creation. Required: ${rent}, Available: ${solBalance}`
        );
      }

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

    // Token Pool and Compression Instruction Creation with Logging
    const TokenPool = await CompressedTokenProgram.createTokenPool({
      mint: tokenAddress,
      feePayer: account.publicKey,
    });

    if (!TokenPool.programId) {
      instructions.push(TokenPool);
      console.log("Token Pool Instruction Added");
    }

    const compressTx = await CompressedTokenProgram.compress({
      payer: account.publicKey,
      owner: account.publicKey,
      source: ata,
      toAddress: account.publicKey,
      amount: adjustedAmount,
      mint: tokenAddress,
    });

    console.log("Compression Transaction Details:", compressTx);
    instructions.push(compressTx);

    // Transaction Preparation with Enhanced Logging
    const transaction = new Transaction();
    transaction.feePayer = account.publicKey;
    transaction.add(...instructions);

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
    console.log("Latest Blockhash:", latestBlockhash.blockhash);

    const signers = [account];

    // Fee Estimation with Detailed Logging
    const fees = await transaction.getEstimatedFee(connection);
    console.log("Transaction Fee Estimation:", {
      estimatedFees: fees,
      solBalance,
    });

    if (fees === null) {
      throw new Error("Unable to estimate transaction fees");
    }

    if (solBalance < fees) {
      throw new Error(
        `Insufficient SOL for transaction fees. Required: ${fees}, Available: ${solBalance}`
      );
    }

    // Transaction Submission with Comprehensive Logging
    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers,
      {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      }
    );

    console.log("Transaction Successfully Submitted:", transactionSignature);
    return apiResponse(true, "compressed", transactionSignature);
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("Compression Process Error:", {
        errorName: error.constructor.name,
        errorMessage: error.message,
        errorStack: error.stack,
      });

    if (error instanceof Error)
      return apiResponse(false, "failed to compress", error.message);
  }
};

interface compressBalanceProps {
  Owner: PublicKeyData;
  rpc: string;
}

//get list of compress token owned by userAddress
export const getCompressTokenBalance = async ({
  address,
  mint,
  rpc,
}: {
  address: string;
  mint: string;
  rpc: string;
}) => {
  const RPC_ENDPOINT = rpc;
  const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
  const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);
  let userPubKey: PublicKey;
  try {
    userPubKey = new PublicKey(address);
  } catch (error) {
    throw new Error("Invalid sender address");
  }
  let mintPubKey: PublicKey;
  try {
    mintPubKey = new PublicKey(mint);
  } catch (error) {
    throw new Error("Invalid sender address");
  }
  const balance = await connection.getCompressedTokenBalancesByOwner(
    userPubKey,
    {
      mint: mintPubKey,
    }
  );
  console.log("done");
  return balance;
};

export const transferCompressedTokens = async ({
  amount,
  userMnemonic,
  sender,
  receiver,
  rpc,
}: {
  amount: number;
  receiver: PublicKeyData;
  userMnemonic: string;
  sender: PublicKeyData;
  rpc: string;
}) => {
  try {
    const RPC_ENDPOINT = rpc;
    const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
    const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);
    const receiverKey = new PublicKey(receiver);
    const senderKey = new PublicKey(sender);
    const seed = await bip39.mnemonicToSeed(userMnemonic);
    //console.log(owner, "seed");
    const seedBytes = seed.slice(0, 32);
    const account = await Keypair.fromSeed(seedBytes);
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

    const instructions = [];

    // 4. Create transfer instruction
    const ix = await CompressedTokenProgram.transfer({
      payer: senderKey,
      inputCompressedTokenAccounts: inputAccounts,
      toAddress: receiverKey,
      amount: amount,
      recentInputStateRootIndices: proof.rootIndices,
      recentValidityProof: proof.compressedProof,
    });

    instructions.push(ix);
    const transaction = new Transaction();
    transaction.feePayer = senderKey;

    transaction.add(...instructions);

    // set the end user as the fee payer

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

    console.log(ix);
    return transactionSignature;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
};

// get list of history of users compressed tokens trx
export const getCompressTokenHistory = async ({
  Owner,
  rpc,
}: compressBalanceProps) => {
  const RPC_ENDPOINT = rpc;
  const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
  const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);

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

export async function fetchCompressedTokens({
  address,
  rpc,
}: {
  address: string;
  rpc: string;
}) {
  const RPC_ENDPOINT = rpc;
  const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
  const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);
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
