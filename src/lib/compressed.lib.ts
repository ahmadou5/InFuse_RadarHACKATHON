import {
  Rpc,
  SignatureWithMetadata,
  WithCursor,
  confirmTx,
  createRpc,
  bn
} from "@lightprotocol/stateless.js";
import * as bip39 from 'bip39'
import { 
  createMint, mintTo,
  CompressedTokenProgram, 
  selectMinCompressedTokenAccountsForTransfer 
} from "@lightprotocol/compressed-token";
import { createAssociatedTokenAccount } from "@solana/spl-token";
import { Keypair, PublicKey, PublicKeyData,  } from "@solana/web3.js";
import { getKeypairFromPrivateKey } from "./helper.lib";
import { ENV } from "./constant/env.constant";



/// Helius exposes Solana and compression RPC endpoints through a single URL
const RPC_ENDPOINT = ENV.RPC
const COMPRESSION_RPC_ENDPOINT = RPC_ENDPOINT;
const connection: Rpc = createRpc(RPC_ENDPOINT, COMPRESSION_RPC_ENDPOINT)
const MINT_KEYPAIR = Keypair.generate();
const mint = MINT_KEYPAIR.publicKey;




//Decompress token Function...............

export const decompressToken = async({
  splAddress,
  amount,
  userAddress,
}:{
  splAddress: PublicKeyData;
  amount: number;
  userAddress: PublicKeyData;
}) => {
try {
const account = getKeypairFromPrivateKey(userAddress.toString())
const tokenAddress = new PublicKey(splAddress)
const ata = await createAssociatedTokenAccount(
    connection,
    account,
    tokenAddress,
    account.publicKey,
);

// 1. Fetch the latest compressed token account state
const compressedTokenAccounts =
    await connection.getCompressedTokenAccountsByOwner(account.publicKey, {
        mint,
    });

// 2. Select accounts to transfer from based on the transfer amount
const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
    compressedTokenAccounts.items,
    amount,
);

// 3. Fetch recent validity proof
const proof = await connection.getValidityProof(
    inputAccounts.map(account => bn(account.compressedAccount.hash)),
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
console.log(decompressIx)
} catch (error) {
  if(error instanceof Error)
    console.log(error.message)
}

}



// Compressionn function...................
export const compressToken = async ({
  userMnemonic,
  splAddress,
  amount
}:{
  userMnemonic:string;
  splAddress: PublicKeyData;
  amount: number;
}) => {
  try {
    const seed = await bip39.mnemonicToSeed(userMnemonic);
    //console.log(seed,'seed')
    const seedBytes = seed.slice(0, 32);
    const account = await Keypair.fromSeed(seedBytes);
    //const account = getKeypairFromPrivateKey(userAddress.toString())
    const tokenAddress = new PublicKey(splAddress)
    const ata = await createAssociatedTokenAccount(
    connection,
    account,
    tokenAddress,
    account.publicKey,
);
    const compressTx = await CompressedTokenProgram.compress({
      payer: account.publicKey,
      owner: account.publicKey,
      source: ata,
      toAddress: account.publicKey,
      amount:amount,
      mint:tokenAddress,
    });

    console.log(compressTx)
  } catch (error) {
    
  }
}


interface compressBalanceProps {
  Owner: PublicKeyData;
}


//get list of compress token owned by userAddress
export const getCompressTokenBalance = async ({address}:{address:PublicKey}) => {
  
  const balance = await connection.getCompressedTokenBalancesByOwner(address)
  console.log('done')
  return balance
}



export const transferCompressedTokens = async ({amount, sender, receiver}:{
  amount: number;
  receiver: PublicKeyData;
  sender: PublicKeyData;
}) => {
   try {
    const receiverKey = new PublicKey(receiver)
    const senderKey = new PublicKey(sender)
    // get the token account state
    const compressedTokenAccounts =
        await connection.getCompressedTokenAccountsByOwner(senderKey, {
            mint,
        });

    // 2. Select accounts to transfer from based on the transfer amount
    const [inputAccounts] = selectMinCompressedTokenAccountsForTransfer(
      compressedTokenAccounts.items,
      amount,
    );

     // 3. Fetch recent validity proof
     const proof = await connection.getValidityProof(
      inputAccounts.map(account => bn(account.compressedAccount.hash)),
    );

    // 4. Create transfer instruction
    const ix = await CompressedTokenProgram.transfer({
      payer: senderKey,
      inputCompressedTokenAccounts: inputAccounts,
      toAddress: receiverKey,
      amount:amount,
      recentInputStateRootIndices: proof.rootIndices,
      recentValidityProof: proof.compressedProof,
    });

    console.log(ix)
   } catch (error) {
    if(error instanceof Error)
      console.log(error.message)
   }
}

// get list of history of users compressed tokens trx
export const getCompressTokenHistory = async ({Owner}:compressBalanceProps) => {
  const key = new PublicKey(Owner)
  const signatures: WithCursor<SignatureWithMetadata[]> =
        await connection.getCompressionSignaturesForOwner(key);
    console.log(signatures);

    const parsedTransaction = 
    await connection.getTransactionWithCompressionInfo(signatures.items[0].signature)
    console.log(parsedTransaction)
    return { signatures, parsedTransaction }
}


// test minnt functions    
export const testMint = async ({Owner}:compressBalanceProps) => {
  const key = new PublicKey(Owner)
  const account = getKeypairFromPrivateKey(Owner.toString())
  try {
    await confirmTx(
      connection,
      await connection.requestAirdrop(key,1e9)
    )

    const { mint, transactionSignature } = await createMint(
      connection,
      account,
      key,
      9,
      account,
    )
    console.log(`create-mint success! txId: ${transactionSignature}`);

    const mintToTxId = await mintTo(
      connection,
      account,
      mint,
      key,
      account,
      5e9,
    );
  console.log(`mint-to success! txId: ${mintToTxId}`);
  } catch (error) {
    if(error instanceof Error)
      console.log(error.message)
  }
}

