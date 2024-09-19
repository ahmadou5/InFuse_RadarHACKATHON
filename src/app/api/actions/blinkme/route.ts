import { BlinkInterface } from '@/interfaces/models.interface'
import {
  blinkError,
  generatePaymentBlink,
  validatedQueryParams,
} from '@/lib/blink.lib'
import { BlinkService } from '@/lib/services/blink.service'
import { SendNativeSol } from '@/lib/solana.lib'
import { getSplTokenAddress, sendSPLToken } from '@/lib/spl.lib'
import {
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from '@solana/actions'
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js'

const headers = ACTIONS_CORS_HEADERS

export const GET = async (req: Request) => {
  const requestUrl = new URL(req.url)
  const blink_id = requestUrl.searchParams.get('blink')

  if (!blink_id) {
    return blinkError("'blink' url param not found")
  }

  // "1ydnsKJhktH6ipyUJWKg"
  const blink = await BlinkService.getOneBlink(blink_id)
  console.log('blink', blink)

  if (!blink.data) {
    return blinkError('Blink Not Found')
  }

  const data = blink.data as BlinkInterface

  const toPubkey = new PublicKey(data?.pub_key)

  const baseHref = new URL(
    `/api/actions/blinkme?blink=${blink_id}&to=${toPubkey.toBase58()}`,
    requestUrl.origin
  ).toString()

  console.log('baseHREF', baseHref)

  return generatePaymentBlink({
    title: data.title,
    description: data.description || '',
    icon: data.image_url || '',
    label: data.image_url || '',
    baseURL: baseHref,
  })
}

// export const OPTIONS = GET

export const POST = async (req: Request) => {
  console.log('I ran', new Date(Date.now()).toLocaleTimeString())
  const requestUrl = new URL(req.url)
  const { amount, toPubkey, blink_id, token } = validatedQueryParams(requestUrl)

  console.log('amount', amount, 'toPubkey', toPubkey.toBase58(), 'token', token)

  try {
    const body: ActionPostRequest = await req.json()

    // validate the client provided input
    let account: PublicKey
    try {
      account = new PublicKey(body.account)
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers,
      })
    }

    const connection = new Connection(clusterApiUrl('mainnet-beta'))
    let transaction: Transaction = new Transaction()

    if (token === 'sol') {
      transaction = await SendNativeSol(connection, {
        amount,
        toPubkey,
        fromPubkey: account,
      })
    } else {
      // await jupSwap({ amount, userPubKey: account })

      transaction = await sendSPLToken(connection, {
        amount,
        toPubKey: toPubkey,
        fromPubKey: account,
        mintAddress: new PublicKey(getSplTokenAddress(token)!),
      })

      // const signedTransaction = await signTr
    }

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: transaction,
        message: `Sent ${amount} SOL to: ${toPubkey.toBase58()}`,
      },
      // note: no additional signers are needed
      // signers: [],
    })

    return Response.json(payload, {
      headers,
    })
  } catch (error: any) {
    console.log(error)
    // return blinkError(error.message || 'unknown error occurred')
    return Response.json({
      error: error.message || 'An unknown error occurred',
    })
  }
}

export const OPTIONS = (req: Request) => {
  return Response.json(null, {
    headers,
  })
}
