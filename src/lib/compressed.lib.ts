import {
  Rpc,
  SignatureWithMetadata,
  WithCursor,
  bn,
  createRpc,
} from '@lightprotocol/stateless.js';

import {
  CompressedTokenProgram,
  createMint,
  mintTo,
  selectMinCompressedTokenAccountsForTransfer,
} from '@lightprotocol/compressed-token';
import * as bip39 from 'bip39';
//import { createAssociatedTokenAccount } from "@solana/spl-token";
import {
  ComputeBudgetProgram,
  Keypair,
  //ParsedAccountData,
  PublicKey,
  PublicKeyData,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
//import { getKeypairFromPrivateKey } from "./helper.lib";
import { BN } from '@coral-xyz/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from '@solana/spl-token';
import { apiResponse } from './api.helpers';
import { ENV } from './constant/env.constant';
/// Helius exposes Solana and compression RPC endpoints through a single URL
const RPC_ENDPOINT = ENV.SOL_DEVNET_RPC;
const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);
//const MINT_KEYPAIR = Keypair.generate();
//const mint = MINT_KEYPAIR.publicKey;

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
  userMnemonic,
  rpc,
}: {
  splAddress: PublicKeyData;
  amount: number;
  userMnemonic: string;
  rpc: string;
}) => {
  try {
    const RPC_ENDPOINT = rpc;
    const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
    const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT);
    const seed = await bip39.mnemonicToSeed(userMnemonic);
    const seedBytes = seed.toString().substring(0, 32);
    const account = Keypair.fromSeed(Uint8Array.from(seedBytes));
    const tokenAddress = new PublicKey(splAddress);

    const ata = await getAssociatedTokenAddress(
      tokenAddress,
      account.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    // Detailed Mint Info Logging
    const mintInfo = await getMint(connection, tokenAddress);

    const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
    const compressedTokenAccounts =
      await connection.getCompressedTokenAccountsByOwner(account.publicKey, {
        mint: tokenAddress,
      });

    // 2. Select accounts to transfer from based on the transfer amount
    const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
      compressedTokenAccounts.items,
      new BN(adjustedAmount)
    );

    // 3. Fetch recent validity proof
    const proof = await connection.getValidityProof(
      inputAccounts.map((account) => bn(account.compressedAccount.hash))
    );

    const solBalance = await connection.getBalance(account.publicKey);
    try {
      const tokenAccount = await getAccount(connection, ata);

      if (BigInt(tokenAccount.amount) < BigInt(adjustedAmount)) {
        throw new Error(
          `Insufficient token balance. Required: ${adjustedAmount}, Available: ${tokenAccount.amount}`
        );
      }
    } catch (error: unknown) {
      console.error('Token Account Retrieval Error:', error);
      if (error instanceof Error)
        throw new Error(`Token account error: ${error.message}`);
    }

    const instructions = [];
    const computeUnitIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: 300_000, // Increased from default, adjust based on testing
    });
    instructions.unshift(computeUnitIx);
    // ATA Existence and Creation Logic with Detailed Logging
    const ifexists = await connection.getAccountInfo(ata);
    if (!ifexists || !ifexists.data) {
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

    // 4. Create the decompress instruction
    const decompressIx = await CompressedTokenProgram.decompress({
      payer: account.publicKey,
      inputCompressedTokenAccounts: inputAccounts,
      toAddress: ata,
      amount: adjustedAmount,
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

    const signers = [account];

    // Fee Estimation with Detailed Logging
    const fees = await transaction.getEstimatedFee(connection);

    if (fees === null) {
      throw new Error('Unable to estimate transaction fees');
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
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
      }
    );
    return apiResponse(true, 'Decompressed', transactionSignature);
  } catch (error) {
    if (error instanceof Error)
      return apiResponse(false, 'unable to compress', error.message);
  }
};

export const compressToken = async ({
  userMnemonic,
  splAddress,
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
    const RPC_ENDPOINT = rpc;
    const connection: Rpc = createRpc(RPC_ENDPOINT, RPC_ENDPOINT);
    const seed = await bip39.mnemonicToSeed(userMnemonic);
    const seedBytes = seed.toString().substring(0, 32);
    const account = Keypair.fromSeed(Uint8Array.from(seedBytes));

    const tokenAddress = new PublicKey(splAddress);

    // Detailed Mint Info Logging
    const mintInfo = await getMint(connection, tokenAddress);
    const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

    // Comprehensive ATA Creation and Balance Checks
    const ata = await getAssociatedTokenAddress(
      tokenAddress,
      account.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const solBalance = await connection.getBalance(account.publicKey);

    // Detailed Token Account Verification
    try {
      const tokenAccount = await getAccount(connection, ata);

      if (BigInt(tokenAccount.amount) < BigInt(adjustedAmount)) {
        throw new Error(
          `Insufficient token balance. Required: ${adjustedAmount}, Available: ${tokenAccount.amount}`
        );
      }
    } catch (error: unknown) {
      console.error('Token Account Retrieval Error:', error);
      if (error instanceof Error)
        throw new Error(`Token account error: ${error.message}`);
    }

    const instructions = [];

    // ATA Existence and Creation Logic with Detailed Logging
    const ifexists = await connection.getAccountInfo(ata);
    if (!ifexists || !ifexists.data) {
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
    }

    const compressTx = await CompressedTokenProgram.compress({
      payer: account.publicKey,
      owner: account.publicKey,
      source: ata,
      toAddress: account.publicKey,
      amount: adjustedAmount,
      mint: tokenAddress,
    });
    instructions.push(compressTx);

    // Transaction Preparation with Enhanced Logging
    const transaction = new Transaction();
    transaction.feePayer = account.publicKey;
    transaction.add(...instructions);

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

    const signers = [account];

    // Fee Estimation with Detailed Logging
    const fees = await transaction.getEstimatedFee(connection);

    if (fees === null) {
      throw new Error('Unable to estimate transaction fees');
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
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
      }
    );

    return apiResponse(true, 'compressed', transactionSignature);
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error('Compression Process Error:', {
        errorName: error.constructor.name,
        errorMessage: error.message,
        errorStack: error.stack,
      });

    if (error instanceof Error)
      return apiResponse(false, 'failed to compress', error.message);
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
    throw new Error('Invalid sender address');
  }
  let mintPubKey: PublicKey;
  try {
    mintPubKey = new PublicKey(mint);
  } catch (error) {
    throw new Error('Invalid sender address');
  }
  const balance = await connection.getCompressedTokenBalancesByOwner(
    userPubKey,
    {
      mint: mintPubKey,
    }
  );

  return balance;
};

export const transferCompressedTokens = async ({
  amount,
  tokenMint,
  userMnemonic,
  sender,
  receiver,
  rpc,
}: {
  amount: number;
  receiver: PublicKeyData;
  tokenMint: PublicKeyData;
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
    const mint = new PublicKey(tokenMint);
    const seed = await bip39.mnemonicToSeed(userMnemonic);
    const seedBytes = seed.toString().substring(0, 32);
    const account = Keypair.fromSeed(Uint8Array.from(seedBytes));
    // get the token account state
    // 2. Get token mint info for decimal adjustment
    const mintInfo = await getMint(connection, mint);
    const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

    // 3. Get token accounts

    const toTokenAccount = await getAssociatedTokenAddress(
      mint,
      receiverKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const solBalance = await connection.getBalance(account.publicKey);

    const compressedTokenAccounts =
      await connection.getCompressedTokenAccountsByOwner(senderKey, {
        mint: mint,
      });

    // 2. Select accounts to transfer from based on the transfer amount
    const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
      compressedTokenAccounts.items,
      new BN(adjustedAmount)
    );
    const instructions = [];
    // 3. Fetch recent validity proof
    const proof = await connection.getValidityProof(
      inputAccounts.map((account) => bn(account.compressedAccount.hash))
    );
    const ifexists = await connection.getAccountInfo(toTokenAccount);
    if (!ifexists || !ifexists.data) {
      const rent = await connection.getMinimumBalanceForRentExemption(165); // Size of ATA account
      if (solBalance < rent) {
        throw new Error('Insufficient SOL for ATA creation');
      }

      const createATAiX = createAssociatedTokenAccountInstruction(
        senderKey,
        toTokenAccount,
        receiverKey,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      instructions.push(createATAiX);
    }

    // 4. Create transfer instruction
    const ix = await CompressedTokenProgram.transfer({
      payer: senderKey,
      inputCompressedTokenAccounts: inputAccounts,
      toAddress: toTokenAccount,
      amount: adjustedAmount,
      recentInputStateRootIndices: proof.rootIndices,
      recentValidityProof: proof.compressedProof,
    });

    instructions.push(ix);
    const transaction = new Transaction();
    transaction.feePayer = senderKey;

    transaction.add(...instructions);

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

    const signers = [account];

    // Fee Estimation with Detailed Logging
    const fees = await transaction.getEstimatedFee(connection);

    if (fees === null) {
      throw new Error('Unable to estimate transaction fees');
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
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
      }
    );
    return apiResponse(true, 'Compress token sent', transactionSignature);
  } catch (error) {
    if (error instanceof Error)
      return apiResponse(false, 'transfer failed', error.message);
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

  const parsedTransaction = await connection.getTransactionWithCompressionInfo(
    signatures.items[0].signature
  );
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

    return tokenAccounts;
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error('Error fetching compressed tokens:', error.message);
    throw error;
  }
}

// test minnt functions
export const testMint = async (mnemonic: string | undefined) => {
  if (mnemonic === undefined) return;
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const seedBytes = seed.toString().substring(0, 32);
  const account = Keypair.fromSeed(Uint8Array.from(seedBytes));
  try {
    const { mint } = await createMint(
      connection,
      account,
      account.publicKey,
      9
    );

    await mintTo(connection, account, mint, account.publicKey, account, 500e9);
  } catch (error) {
    if (error instanceof Error)
      console.error('error', error.message, 'message');
  }
};
