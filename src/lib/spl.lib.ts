import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as bip39 from "bip39";
import {
  Connection,
  sendAndConfirmTransaction,
  ParsedAccountData,
  PublicKey,
  ConfirmedSignatureInfo,
  ParsedInstruction,
  clusterApiUrl,
  Transaction,
  Keypair,
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

async function getNumberDecimals(
  connection: Connection,
  mintAddress: PublicKey
): Promise<number> {
  const info = await connection.getParsedAccountInfo(mintAddress);
  const result = (info.value?.data as ParsedAccountData).parsed.info
    .decimals as number;
  return result;
}

export const SendSplToken = async (
  connection: Connection,
  {
    amount,
    mnemonic,
    fromPubKey,
    toPubKey,
    mintAddress,
  }: {
    amount: number;
    mnemonic: string;
    fromPubKey: PublicKey;
    toPubKey: PublicKey;
    mintAddress: PublicKey;
  }
) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const numberDecimals_ = await getNumberDecimals(connection, mintAddress);

    const seed = await bip39.mnemonicToSeed(mnemonic);
    const seedBytes = seed.slice(0, 32);
    const account = Keypair.fromSeed(seedBytes);
    let transferAmount: number = parseFloat(amount.toString());
    // .toFixed() returns a string, so we need to parse it back to a number
    transferAmount = Number(transferAmount.toFixed(numberDecimals_));
    transferAmount = transferAmount * Math.pow(10, numberDecimals_);

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

    const ifexists = await connection.getAccountInfo(toTokenAccount);

    const instructions = [];

    if (!ifexists || !ifexists.data) {
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

    const transferInstruction = createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromPubKey,
      transferAmount
    );
    instructions.push(transferInstruction);

    const transaction = new Transaction();
    transaction.feePayer = fromPubKey;

    transaction.add(...instructions);

    // set the end user as the fee payer
    transaction.feePayer = fromPubKey;

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
    return transactionSignature;
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new Error(error.message || "Unknown error occurred");
  }
};
