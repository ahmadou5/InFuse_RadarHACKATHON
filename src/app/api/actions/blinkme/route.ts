import { BlinkInterface } from '@/interfaces/models.interface'
import {
  blinkError,
  generatePaymentBlink,
  //validatedQueryParams,
} from '@/lib/blink.lib'
import { BlinkService } from '@/lib/services/blink.service'
//import { SendNativeSol } from '@/lib/solana.lib'
//import { getSplTokenAddress, sendSPLToken } from '@/lib/spl.lib'
import {
 
  ACTIONS_CORS_HEADERS,
  
} from '@solana/actions'
import {
  
  PublicKey,
  
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

  if (!blink?.data) {
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


export const OPTIONS = (req: Request) => {
  console.log(req)
  return Response.json(null, {
    headers,
  })
}
