import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  getMint,
  getAccount,
} from "@solana/spl-token";
import * as bip39 from "bip39";
import {
  Connection,
  sendAndConfirmTransaction,
  PublicKey,
  ConfirmedSignatureInfo,
  ParsedInstruction,
  Transaction,
  Keypair,
  ComputeBudgetProgram,
} from "@solana/web3.js";

// Interfaces
export interface TokenTransactionOptions {
  cluster?: string;
  limit?: number;
  mintAddress?: string;
}

export interface TokenInfo {
  mint: string;
  decimals: number;
}

export interface TokenTransactionData {
  signature: string;
  timestamp: number | null;
  slot: number;
  fee: number;
  type: "receive" | "send" | "mint" | "burn";
  amount: number;
  rawAmount: string;
  tokenInfo: TokenInfo;
  fromAddress: string;
  toAddress: string;
  status: "success" | "failed";
  instructionType: string;
}

export type ParsedTokenInstruction = ParsedInstruction & {
  parsed: {
    type: string;
    info: {
      authority?: string;
      source?: string;
      destination?: string;
      amount?: string;
    };
  };
};

export class TokenTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenTransactionError";
  }
}

function parseTokenAmount(amount: string, decimals: number): number {
  return parseFloat(amount) / Math.pow(10, decimals);
}

export async function getSPLTokenTransactions(
  address: string,
  options: TokenTransactionOptions = {}
): Promise<TokenTransactionData[]> {
  try {
    const connection = new Connection(
      options.cluster || "https://api.mainnet-beta.solana.com",
      "confirmed"
    );

    let pubKey: PublicKey;
    try {
      pubKey = new PublicKey(address);
    } catch (error) {
      throw new TokenTransactionError(
        `Invalid Solana address: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    const signatures: ConfirmedSignatureInfo[] =
      await connection.getSignaturesForAddress(pubKey, {
        limit: options.limit || 100,
      });

    const transactions: (TokenTransactionData | null)[] = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const tx = await connection.getParsedTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (
            !tx?.meta ||
            !tx.meta.preTokenBalances ||
            !tx.meta.postTokenBalances
          ) {
            return null;
          }

          const tokenInstructions = tx.transaction.message.instructions.filter(
            (instruction): instruction is ParsedTokenInstruction => {
              const programId =
                "programId" in instruction
                  ? instruction.programId.toString()
                  : "";
              return programId === TOKEN_PROGRAM_ID.toString();
            }
          );

          if (tokenInstructions.length === 0) {
            return null;
          }

          const tokenTxs = tokenInstructions.map((instruction) => {
            const parsed = instruction.parsed;
            if (!parsed) return null;

            const preBalance = tx.meta?.preTokenBalances?.find(
              (balance) => balance.owner === address
            );
            const postBalance = tx.meta?.postTokenBalances?.find(
              (balance) => balance.owner === address
            );

            if (!preBalance || !postBalance) return null;

            const mintAddress = preBalance.mint;
            const decimals = preBalance.uiTokenAmount.decimals;

            const isReceiver = parsed.info.destination === address;
            let txType: TokenTransactionData["type"] = "send";
            if (parsed.type === "mint") txType = "mint";
            else if (parsed.type === "burn") txType = "burn";
            else if (isReceiver) txType = "receive";

            const rawAmount = (
              BigInt(postBalance.uiTokenAmount.amount) -
              BigInt(preBalance.uiTokenAmount.amount)
            ).toString();
            const amount = parseTokenAmount(rawAmount, decimals);

            return {
              signature: sig.signature,
              timestamp: tx.blockTime || null,
              slot: tx.slot,
              fee: tx.meta?.fee || 0,
              type: txType,
              amount: Math.abs(amount),
              rawAmount: rawAmount,
              tokenInfo: {
                mint: mintAddress,
                decimals: decimals,
              },
              fromAddress: parsed.info.authority || parsed.info.source || "",
              toAddress: parsed.info.destination || "",
              status: tx.meta?.err ? "failed" : "success",
              instructionType: parsed.type,
            } satisfies TokenTransactionData;
          });

          return tokenTxs.filter(
            (tx): tx is TokenTransactionData => tx !== null
          )[0];
        } catch (error) {
          console.error(
            `Error processing transaction ${sig.signature}:`,
            error
          );
          return null;
        }
      })
    );

    const validTransactions = transactions.filter(
      (tx): tx is TokenTransactionData => tx !== null
    );

    if (options.mintAddress) {
      return validTransactions.filter(
        (tx) => tx.tokenInfo.mint === options.mintAddress
      );
    }

    return validTransactions;
  } catch (error) {
    if (error instanceof TokenTransactionError) {
      throw error;
    }
    throw new TokenTransactionError(
      `Error fetching token transactions: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export const getSplTokenAddress = (token: string) =>
  ({
    send: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
    usdc: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  }[token]);

export const SendSplToken = async (
  connection: Connection,
  {
    amount,
    mnemonic,
    fromPubKey,
    toPubKey,
    mintAddress,
  }: // feePayerKeypair, // Add this new parameter for cases where fromPubKey is different from derived account
  {
    amount: number;
    mnemonic: string;
    fromPubKey: PublicKey;
    toPubKey: PublicKey;
    mintAddress: PublicKey;
    // feePayerKeypair?: Keypair;
  }
) => {
  try {
    // 1. Generate keypair from mnemonic
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const seedBytes = seed.slice(0, 32);
    const account = Keypair.fromSeed(seedBytes);

    // 2. Get token mint info for decimal adjustment
    const mintInfo = await getMint(connection, mintAddress);
    const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

    // 3. Get token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(
      mintAddress,
      fromPubKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const toTokenAccount = await getAssociatedTokenAddress(
      mintAddress,
      toPubKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // 4. Check balances
    const solBalance = await connection.getBalance(fromPubKey);

    try {
      const tokenAccount = await getAccount(connection, fromTokenAccount);
      if (BigInt(tokenAccount.amount) < BigInt(adjustedAmount)) {
        throw new Error("Insufficient token balance");
      }
    } catch (e) {
      throw new Error("Token account not found or insufficient balance");
    }

    // 5. Prepare instructions array
    const instructions = [];
    const computeUnitIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: 300_000, // Increased from default, adjust based on testing
    });
    instructions.unshift(computeUnitIx);
    // 6. Check if destination account exists and create if needed
    const ifexists = await connection.getAccountInfo(toTokenAccount);
    if (!ifexists || !ifexists.data) {
      const rent = await connection.getMinimumBalanceForRentExemption(165); // Size of ATA account
      if (solBalance < rent) {
        throw new Error("Insufficient SOL for ATA creation");
      }

      const createATAiX = createAssociatedTokenAccountInstruction(
        fromPubKey,
        toTokenAccount,
        toPubKey,
        mintAddress,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      instructions.push(createATAiX);
    }

    // 7. Create transfer instruction with adjusted amount
    const transferInstruction = createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromPubKey,
      adjustedAmount
    );
    instructions.push(transferInstruction);

    // 8. Build transaction
    const transaction = new Transaction();
    transaction.feePayer = fromPubKey;
    transaction.add(...instructions);

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    // 9. Handle signers
    const signers = [account];

    // 10. Estimate transaction fee
    const fees = await transaction.getEstimatedFee(connection);
    if (fees === null) return;
    if (solBalance < fees) {
      throw new Error(
        `Insufficient SOL for transaction fees. Required: ${fees}, Available: ${solBalance}`
      );
    }

    // 11. Send and confirm transaction
    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers,
      {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      }
    );

    return {
      signature: transactionSignature,
      adjustedAmount,
      fees,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Transaction failed:", error.message);
      throw error; // Re-throw to allow proper error handling by caller
    }
    throw new Error("An unknown error occurred");
  }
};
