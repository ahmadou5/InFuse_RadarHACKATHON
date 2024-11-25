import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
  PublicKeyData,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  ConfirmedSignatureInfo,
} from "@solana/web3.js";
import { createTransferInstruction } from "@solana/spl-token";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as bip39 from "bip39";
import { getSolPrice } from "./helper.lib";
import { TransactionDetails } from "@/interfaces/models.interface";
import bs58 from "bs58";
//import { useNetwork } from "@/context/NetworkContext";

// Constants

export interface TransactionOptions {
  cluster?: string;
  limit?: number;
}

export interface TransactionData {
  signature: string;
  timestamp: number | null;
  slot: number;
  fee: number;
  amount: {
    lamports: number;
    sol: number;
    formatted: string;
  };
  type: "receive" | "send";
  fromAddress: string;
  toAddress: string;
  status: "success" | "failed";
}

export type TransactionDataArray = TransactionData[];

export interface FilterFunctions {
  received: () => TransactionDataArray;
  sent: () => TransactionDataArray;
  dateRange: (
    startDate: string | Date,
    endDate: string | Date
  ) => TransactionDataArray;
  amountGreaterThan: (amount: number) => TransactionDataArray;
}

export interface TransactionResult {
  transactions: TransactionDataArray;
  filters: FilterFunctions;
}

export class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransactionError";
  }
}

function formatSolAmount(lamports: number): string {
  const sol = Math.abs(lamports) / LAMPORTS_PER_SOL;
  if (sol >= 1) {
    return sol.toFixed(9).replace(/\.?0+$/, "");
  } else {
    return sol.toFixed(9);
  }
}

export async function getSolanaTransactions(
  address: string,
  options: TransactionOptions = {}
): Promise<TransactionResult> {
  try {
    const connection = new Connection(
      options.cluster || "https://api.mainnet-beta.solana.com",
      "confirmed"
    );

    let pubKey: PublicKey;
    try {
      pubKey = new PublicKey(address);
    } catch (error) {
      throw new TransactionError(
        `Invalid Solana address: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    const signatures: Array<ConfirmedSignatureInfo> =
      await connection.getSignaturesForAddress(pubKey, {
        limit: options.limit || 100,
      });

    const transactions: Array<TransactionData | unknown> = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx || !tx.meta) return null;

          const accountKeys = tx.transaction.message.staticAccountKeys;
          const fromAddress = accountKeys[0]?.toBase58() || "";
          const toAddress = accountKeys[1]?.toBase58() || "";

          const isReceiver = fromAddress !== address;

          // Calculate amount changes for the relevant address
          let relevantIndex: number;
          if (isReceiver) {
            // If receiving, look for our address in postBalances
            relevantIndex = accountKeys.findIndex(
              (key) => key.toBase58() === address
            );
          } else {
            // If sending, we're the first account (index 0)
            relevantIndex = 0;
          }

          if (relevantIndex === -1) return null;

          const preBalance = tx.meta.preBalances[relevantIndex] || 0;
          const postBalance = tx.meta.postBalances[relevantIndex] || 0;

          // Calculate the raw amount change in lamports
          let lamportChange = postBalance - preBalance;

          // For send transactions, add the fee to the amount
          if (!isReceiver && tx.meta.fee) {
            lamportChange += tx.meta.fee;
          }

          // Ensure amount is negative for sends and positive for receives
          const finalLamportAmount = isReceiver
            ? Math.abs(lamportChange)
            : -Math.abs(lamportChange);

          return {
            signature: sig.signature,
            timestamp: tx.blockTime,
            slot: tx.slot,
            fee: tx.meta.fee || 0,
            amount: {
              lamports: finalLamportAmount,
              sol: finalLamportAmount / LAMPORTS_PER_SOL,
              formatted: formatSolAmount(finalLamportAmount),
            },
            type: isReceiver ? "receive" : "send",
            fromAddress,
            toAddress,
            status: tx.meta.err ? "failed" : "success",
          };
        } catch (error) {
          console.error(
            `Error processing transaction ${sig.signature}:`,
            error
          );
          return null;
        }
      })
    );

    const validTransactions: TransactionDataArray = transactions.filter(
      (tx): tx is TransactionData => tx !== null
    );

    const filterFunctions: FilterFunctions = {
      received: () => validTransactions.filter((tx) => tx.type === "receive"),

      sent: () => validTransactions.filter((tx) => tx.type === "send"),

      dateRange: (startDate: string | Date, endDate: string | Date) => {
        const start = new Date(startDate).getTime() / 1000;
        const end = new Date(endDate).getTime() / 1000;
        return validTransactions.filter(
          (tx) =>
            tx.timestamp !== null &&
            tx.timestamp >= start &&
            tx.timestamp <= end
        );
      },

      amountGreaterThan: (amount: number) => {
        const lamports = amount * LAMPORTS_PER_SOL;
        return validTransactions.filter(
          (tx) => Math.abs(tx.amount.lamports) > lamports
        );
      },
    };

    return {
      transactions: validTransactions,
      filters: filterFunctions,
    };
  } catch (error) {
    if (error instanceof TransactionError) {
      throw error;
    }
    throw new TransactionError(
      `Error fetching transactions: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

interface HandleSendSolParams {
  receiveAddress: string;
  connection: Connection;
  userMnemonic: string;
  amount: string | number;
}

export const handleSendSol = async ({
  receiveAddress,
  userMnemonic,
  connection,
  amount,
}: HandleSendSolParams) => {
  try {
    // Convert amount to number if it's a string
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    // Validate amount
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error("Invalid amount");
    }

    const seed = await bip39.mnemonicToSeed(userMnemonic);
    const seedBytes = seed.slice(0, 32);
    const account = Keypair.fromSeed(seedBytes);

    const { blockhash } = await connection.getLatestBlockhash();

    // Validate receive address
    let receivePubKey: PublicKey;
    try {
      receivePubKey = new PublicKey(receiveAddress);
    } catch (error) {
      throw new Error("Invalid receive address");
    }

    const instruction = SystemProgram.transfer({
      fromPubkey: account.publicKey,
      toPubkey: receivePubKey,
      lamports: numericAmount * LAMPORTS_PER_SOL,
    });

    const messageV0 = new TransactionMessage({
      payerKey: new PublicKey(account.publicKey),
      recentBlockhash: blockhash,
      instructions: [instruction],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
    // Get the fee for the transaction
    const fee = await connection.getFeeForMessage(messageV0, "confirmed");

    // Convert fee from lamports to SOL
    if (fee === undefined) return;
    const feeInSol = 0.0005;

    transaction.sign([account]);

    const txid = await connection.sendTransaction(transaction);
    console.log(`Transaction ID: ${txid}`);

    await connection.confirmTransaction(txid, "confirmed");
    return { txid, feeInSol };
  } catch (error) {
    console.error("Error sending SOL:", error);
    return undefined;
  }
};

// Example usage
export const sendNativeSol = async (
  connection: Connection,
  {
    amount,
    fromPubkey,
    toPubkey,
  }: {
    amount: number;
    fromPubkey: PublicKey;
    toPubkey: PublicKey;
  }
) => {
  try {
    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0 // note: simple accounts that just store native SOL have `0` bytes of data
    );

    if (amount < minimumBalance) {
      throw new Error(`account may not be rent exempt: ${toPubkey.toBase58()}`);
      // return Response.json({
      //   error: `account may not be rent exempt: ${toPubkey.toBase58()}`,
      // })
    }

    // create an instruction to transfer native SOL from one wallet to another
    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: toPubkey,
      lamports: amount,
    });

    // get the latest blockhash amd block height
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    // create a legacy transaction
    const transaction = new Transaction({
      feePayer: fromPubkey,
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction);

    // const transaction = new Transaction().add(
    //   SystemProgram.transfer({
    //     fromPubkey: fromPubkey,
    //     toPubkey: toPubkey,
    //     lamports: amount,
    //   })
    // )
    // transaction.feePayer = fromPubkey
    // transaction.recentBlockhash = (
    //   await connection.getLatestBlockhash()
    // ).blockhash
    // transaction.lastValidBlockHeight = (
    //   await connection.getLatestBlockhash()
    // ).lastValidBlockHeight

    return transaction;
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new Error(error.message || "Unknown error occurred");
  }
};

export const transferSpl = async ({
  mnemonicString,
  splTokenAddress,
  receiver,
  amount,
}: {
  mnemonicString: string;
  splTokenAddress: PublicKeyData;
  receiver: PublicKeyData;
  amount: number;
}) => {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonicString);
    // console.log(seed,'seed')
    const seedBytes = seed.slice(0, 32);
    const account = await Keypair.fromSeed(seedBytes);
    const connection = new Connection(clusterApiUrl("devnet"));
    const tokenAddress = new PublicKey(splTokenAddress);
    const receiverKey = new PublicKey(receiver);
    //const account = getKeypairFromPrivateKey(sender.toString());

    // Create instruction to transfer tokens
    const instruction = createTransferInstruction(
      account.publicKey, // transfer from
      receiverKey, // transfer to
      account.publicKey, // source token account owner
      amount, // amount
      [],
      tokenAddress
    );

    const transaction = new Transaction().add(instruction);

    // Sign and send transaction
    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [
        account, // payer, owner
      ]
    );
    console.log(
      "\nTransaction Signature:",
      `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    );

    return transactionSignature;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    } else {
      throw new Error(
        "An unknown error occurred while creating the transaction"
      );
    }
  }
};

export async function getSplTokenBalance(
  connection: Connection,
  tokenAddress: string,
  userAddress: string
): Promise<number> {
  try {
    let tokenPublicKey: PublicKey;
    try {
      tokenPublicKey = new PublicKey(tokenAddress);
    } catch (error) {
      throw new Error("Invalid  address");
    }
    let userPublicKey: PublicKey;
    try {
      userPublicKey = new PublicKey(userAddress);
    } catch (error) {
      throw new Error("Invalid sender address");
    }

    // Get the associated token account address
    const associatedTokenAddress = await getAssociatedTokenAddress(
      tokenPublicKey,
      userPublicKey
    );
    console.log(associatedTokenAddress, "addewss");
    // Check if the account exists
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);

    if (accountInfo === null) {
      // Account doesn't exist, which means the balance is 0
      return 0;
    }
    console.log(accountInfo, "info");
    // Fetch the token account info
    const tokenAccountInfo = await connection.getTokenAccountBalance(
      associatedTokenAddress
    );
    console.log(tokenAccountInfo.value.amount);
    // Return the balance as a number
    return Number(tokenAccountInfo.value.uiAmount);
  } catch (error) {
    console.error("Error fetching SPL token balance:", error);
    // If there's an error, return 0
    return 0;
  }
}

export const createSolanaWallet = async (seedArray: Uint8Array) => {
  try {
    //const { seedArray } = await GenerateSeed();
    const account = await Keypair.fromSeed(seedArray);
    //console.log(account)
    const publicKey = account.publicKey.toString();
    const privateKey = account.secretKey;
    const secret = bs58.encode(privateKey);
    return { publicKey, secret };
  } catch (error) {
    if (error instanceof Error)
      console.log("Account Creation Error", error.message);
  }
};

export const importSolanaWallet = async ({
  privateKey,
}: {
  privateKey: string;
}) => {
  {
    /**try {
    const decode = bs58.decode(privateKey);
    const account = await Keypair.fromSecretKey(decode);
    const publickey = account.publicKey.toString();
    const privatekey = account.publicKey.toString();
    

    return { publickey, privatekey};
  } catch (error) {
    console.log(error)
  }
  **/
  }
  console.log(privateKey);
};

export const GetUserReceiveTransaction = async (
  connection: Connection,
  address: PublicKey
) => {
  try {
    const pubKey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(pubKey, {
      limit: 30,
    });

    const txDetails: TransactionDetails[] = await Promise.all(
      signatures.map(async (sig) => {
        const tx = await connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });
        if (!tx)
          throw new Error(`Failed to fetch transaction ${sig.signature}`);

        let direction: "received" | "sent" = "received";
        let amount = 0;

        // Determine if the transaction is sent or received
        tx.transaction.message.accountKeys.forEach((account, index) => {
          if (account.pubkey === address) {
            if (tx.meta && tx.meta.postBalances && tx.meta.preBalances) {
              if (tx.meta.postBalances[index] < tx.meta.preBalances[index]) {
                direction = "received";
                amount =
                  (tx.meta.preBalances[index] - tx.meta.postBalances[index]) /
                  1e9;
              } else if (
                tx.meta.postBalances[index] > tx.meta.preBalances[index]
              ) {
                amount =
                  (tx.meta.postBalances[index] - tx.meta.preBalances[index]) /
                  1e9;
              }
            }
          }
        });

        return {
          signature: sig.signature,
          blockTime: tx.blockTime
            ? new Date(tx.blockTime * 1000).toLocaleString()
            : "Unknown",
          fee: tx.meta?.fee ? tx.meta.fee / 1e9 : 0,
          direction,
          amount,
        };
      })
    );
    return txDetails;
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new Error(`Failed to fetch transaction ${error.message}`);
  }
};

export const GetUserSentTransaction = async (
  connection: Connection,
  address: PublicKey
) => {
  try {
    const pubKey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(pubKey, {
      limit: 30,
    });

    const txDetails: TransactionDetails[] = await Promise.all(
      signatures.map(async (sig) => {
        const tx = await connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });
        if (!tx)
          throw new Error(`Failed to fetch transaction ${sig.signature}`);

        let direction: "sent" | "received" = "sent";
        let amount = 0;

        // Determine if the transaction is sent or received
        tx.transaction.message.accountKeys.forEach((account, index) => {
          if (account.pubkey === address) {
            if (tx.meta && tx.meta.postBalances && tx.meta.preBalances) {
              if (tx.meta.postBalances[index] < tx.meta.preBalances[index]) {
                direction = "sent";
                amount =
                  (tx.meta.preBalances[index] - tx.meta.postBalances[index]) /
                  1e9;
              } else if (
                tx.meta.postBalances[index] > tx.meta.preBalances[index]
              ) {
                amount =
                  (tx.meta.postBalances[index] - tx.meta.preBalances[index]) /
                  1e9;
              }
            }
          }
        });

        return {
          signature: sig.signature,
          blockTime: tx.blockTime
            ? new Date(tx.blockTime * 1000).toLocaleString()
            : "Unknown",
          fee: tx.meta?.fee ? tx.meta.fee / 1e9 : 0,
          direction,
          amount,
        };
      })
    );
    return txDetails;
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new Error(`Failed to fetch transaction ${error.message}`);
  }
};

export const fetchSolPriceB = async ({
  user,
}: {
  user: string | undefined;
}) => {
  try {
    if (!user) {
      return;
    }
    const connection = new Connection(clusterApiUrl("devnet"));
    const userAddress = new PublicKey(user);
    const price = await getSolPrice("solana");
    const balance = await connection.getBalance(userAddress);
    return { price, balance };
  } catch (error) {
    throw error;
  }
};
