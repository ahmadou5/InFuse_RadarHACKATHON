import {
    clusterApiUrl,
    Connection,
    //LAMPORTS_PER_SOL,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
  } from '@solana/web3.js'
import { GenerateSeed } from './helper.lib'
import { TransactionDetails } from '@/interfaces/models.interface'
import bs58 from 'bs58'
 
  export const SendNativeSol = async (
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
      const connection = new Connection(clusterApiUrl('mainnet-beta'))
      // ensure the receiving account will be rent exempt
      const minimumBalance = await connection.getMinimumBalanceForRentExemption(
        0 // note: simple accounts that just store native SOL have `0` bytes of data
      )
  
      console.log('minimum balance', minimumBalance, amount )
      if (amount < minimumBalance) {
        // throw `account may not be rent exempt: ${toPubkey.toBase58()}`
        // return Response.json({
        //   error: `account may not be rent exempt: ${toPubkey.toBase58()}`,
        // })
      }
  
      // create an instruction to transfer native SOL from one wallet to another
      const transferSolInstruction = SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey: toPubkey,
        lamports: amount ,
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
  
      return transaction
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create transaction: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while creating the transaction');
      }
    }
  }


  export const createSolanaWallet = async () => {
    try {
      const { mnemonic, seedArray } = await GenerateSeed()
      const account = await Keypair.fromSeed(seedArray);
      //console.log(account)
      const publicKey = account.publicKey.toString();
      const privateKey = account.secretKey;
      const secret = bs58.encode(privateKey)
      return { publicKey, secret, mnemonic }
    } catch (error) {
      if(error instanceof Error)
        console.log('Account Creation Error' , error.message)
    }
  }
  

  export const importSolanaWallet = async (
    {seedPhrase}:{seedPhrase: string;}
  ) => {
    console.log(seedPhrase)
  }


  export const GetUserTransaction = async (
    connection: Connection,
    address: PublicKey
  ) => {
    try {
      const pubKey = new PublicKey(address);
      const signatures = await connection.getSignaturesForAddress(pubKey, {
        limit: 20,
        
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