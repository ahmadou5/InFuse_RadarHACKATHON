import {
    clusterApiUrl,
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
  } from '@solana/web3.js'


  console.log(clusterApiUrl,Connection,LAMPORTS_PER_SOL,PublicKey,SystemProgram,Transaction)

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


  export const createSolanaWallet = async ({
    phrase,
    somethingElse
  }:{
    phrase: string;
    somethingElse: string
  }) => {
    console.log(phrase,somethingElse)
  }
  

  export const importSolanaWallet = async (
    {seedPhrase}:{seedPhrase: string;}
  ) => {
    console.log(seedPhrase)
  }