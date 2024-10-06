import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
  } from '@solana/spl-token'
  import {
    Connection,
    ParsedAccountData,
    PublicKey,
    Transaction,
  } from '@solana/web3.js'
  export const getSplTokenAddress = (token: string) =>
    ({
      send: 'SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa',
      usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    }[token])
  
  async function getNumberDecimals(
    connection: Connection,
    mintAddress: PublicKey
  ): Promise<number> {
    const info = await connection.getParsedAccountInfo(mintAddress)
    const result = (info.value?.data as ParsedAccountData).parsed.info
      .decimals as number
    return result
  }
  
  export const SendSplToken = async (
    connection: Connection,
    {
      amount,
      fromPubKey,
      toPubKey,
      mintAddress,
    }: {
      amount: number
      fromPubKey: PublicKey
      toPubKey: PublicKey
      mintAddress: PublicKey
    }
  ) => {
    try {
      const numberDecimals_ = await getNumberDecimals(connection, mintAddress)
  
      let transferAmount: number = parseFloat(amount.toString())
    // .toFixed() returns a string, so we need to parse it back to a number
      transferAmount = Number(transferAmount.toFixed(numberDecimals_))
      transferAmount = transferAmount * Math.pow(10, numberDecimals_)
  
      const fromTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        fromPubKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
  
      const toTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        toPubKey,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
  
      const ifexists = await connection.getAccountInfo(toTokenAccount)
  
      const instructions = []
  
      if (!ifexists || !ifexists.data) {
        const createATAiX = createAssociatedTokenAccountInstruction(
          fromPubKey,
          toTokenAccount,
          toPubKey,
          mintAddress,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
        instructions.push(createATAiX)
      }
  
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromPubKey,
        transferAmount
      )
      instructions.push(transferInstruction)
  
      const transaction = new Transaction()
      transaction.feePayer = fromPubKey
  
      transaction.add(...instructions)
  
      // set the end user as the fee payer
      transaction.feePayer = fromPubKey
  
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash
  
      return transaction
    } catch (error: unknown) {
      if(error instanceof Error)throw new Error(error.message || 'Unknown error occurred')
    }
  }