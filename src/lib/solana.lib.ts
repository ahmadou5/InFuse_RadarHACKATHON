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
} from "@solana/web3.js";
import { createTransferInstruction,  } from "@solana/spl-token";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as bip39 from 'bip39'
import { GenerateSeed, getSolPrice } from "./helper.lib";
import { TransactionDetails } from "@/interfaces/models.interface";
import  bs58 from "bs58";


interface HandleSendSolParams {
  receiveAddress: string;
  userMnemonic: string;
  amount: string | number;
}



export const handleSendSol = async ({
  receiveAddress,
  userMnemonic,
  amount
}: HandleSendSolParams) => {
  try {
    // Convert amount to number if it's a string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Validate amount
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error("Invalid amount");
    }

    const seed = await bip39.mnemonicToSeed(userMnemonic);
    const seedBytes = seed.slice(0, 32);
    const account = Keypair.fromSeed(seedBytes);
    
    const connection = new Connection(clusterApiUrl('devnet'), "confirmed");

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
      toPubkey:receivePubKey,
      lamports: numericAmount * LAMPORTS_PER_SOL,
    });

    
    
     

    const messageV0 = new TransactionMessage({
      payerKey: new PublicKey(account.publicKey),
      recentBlockhash: blockhash,
      instructions: [instruction],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
     // Get the fee for the transaction
    const fee = await connection.getFeeForMessage(
      messageV0,
      'confirmed'
    );
    
    // Convert fee from lamports to SOL
    if(fee === undefined) return
    const feeInSol = 0.0005;


    transaction.sign([account]);
    
    const txid = await connection.sendTransaction(transaction);
    console.log(`Transaction ID: ${txid}`);
    
    await connection.confirmTransaction(txid, "confirmed");
    return {txid, feeInSol};
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
    amount: number
    fromPubkey: PublicKey
    toPubkey: PublicKey
  }
) => {
  try {
    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0 // note: simple accounts that just store native SOL have `0` bytes of data
    )

    if (amount < minimumBalance) {
      throw new Error(`account may not be rent exempt: ${toPubkey.toBase58()}`)
      // return Response.json({
      //   error: `account may not be rent exempt: ${toPubkey.toBase58()}`,
      // })
    }

    // create an instruction to transfer native SOL from one wallet to another
    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: toPubkey,
      lamports: amount,
    })

    // get the latest blockhash amd block height
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash()

    // create a legacy transaction
    const transaction = new Transaction({
      feePayer: fromPubkey,
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction)

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

    return transaction
  } catch (error: unknown) {
    if(error instanceof Error)throw new Error(error.message || 'Unknown error occurred')
  }
}

export const transferSpl = async (
 
  {
    mnemonicString,
    splTokenAddress,
    receiver,
    amount,
  }: {
    mnemonicString: string;
    splTokenAddress: PublicKeyData;
    receiver: PublicKeyData;
    amount: number;
  }
) => {
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
    const tokenPublicKey = new PublicKey(tokenAddress);
    const userPublicKey = new PublicKey(userAddress);

    // Get the associated token account address
    const associatedTokenAddress = await getAssociatedTokenAddress(
      tokenPublicKey,
      userPublicKey
    );

    // Check if the account exists
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);

    if (accountInfo === null) {
      // Account doesn't exist, which means the balance is 0
      return 0;
    }

    // Fetch the token account info
    const tokenAccountInfo = await connection.getTokenAccountBalance(
      associatedTokenAddress
    );

    // Return the balance as a number
    return Number(tokenAccountInfo.value.uiAmount);
  } catch (error) {
    console.error("Error fetching SPL token balance:", error);
    // If there's an error, return 0
    return 0;
  }
}

export const createSolanaWallet = async () => {
  try {
    const { mnemonic, seedArray } = await GenerateSeed();
    const account = await Keypair.fromSeed(seedArray);
    //console.log(account)
    const publicKey = account.publicKey.toString();
    const privateKey = account.secretKey;
    const secret = bs58.encode(privateKey);
    return { publicKey, secret, mnemonic };
  } catch (error) {
    if (error instanceof Error)
      console.log("Account Creation Error", error.message);
  }
};

export const importSolanaWallet = async ({
  seedPhrase,
}: {
  seedPhrase: string;
}) => {
  console.log(seedPhrase);
};

export const GetUserTransaction = async (
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

        let direction: "sent" | "received" = "received";
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
  user
}:{user:string|undefined}) => {
    try {
      if(!user) {
        return
      }
      const connection = new Connection(clusterApiUrl("devnet"));
      const userAddress = new PublicKey(user)
      const price = await getSolPrice('solana')
      const balance = await connection.getBalance(userAddress)
      return {price, balance};
     
    } catch (error) {
      throw error
    }
  }
