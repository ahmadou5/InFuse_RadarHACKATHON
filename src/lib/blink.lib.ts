import { ActionGetResponse, ACTIONS_CORS_HEADERS } from '@solana/actions'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

export const blinkError = (errorMessage: string) => {
  const action: ActionGetResponse = {
    title: 'An error occur',
    icon: 'https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/',
    description: ``,
    label: '',
    type: 'action',
    disabled: true,
    error: { message: errorMessage },
  }
  return Response.json(action, { headers: ACTIONS_CORS_HEADERS })
}

export const generatePaymentBlink = ({
  title,
  description,
  icon,
  label,
  baseURL,
}: {
  title: string
  icon: string
  description: string
  label: string
  baseURL: string
}) => {
  const payload: ActionGetResponse = {
    title,
    icon:
      icon ||
      'https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/',
    description,
    label,
    type: 'action',
    links: {
      actions: [
        {
          label: '😉',
          href: `${baseURL}&amount={amount}&token={token}`,
          parameters: [
            {
              type: 'radio',
              label: 'Token',
              name: 'token',
              options: [
                { label: 'SOL', value: 'sol', selected: true },
                
              ],
            },
            {
              name: 'amount',
              required: true,
              label: 'Send a custom amount',
            },
          ],
        },
      ],
    },
  }

  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
}

export const validatedQueryParams = (requestUrl: URL) => {
  let amount: number = 0
  let blink_id: string = ''
  let token: string = ''

  let toPubkey: PublicKey = new PublicKey(
    '5QDwYS1CtHzN1oJ2eij8Crka4D2eJcUavMcyuvwNRM9'
  )

  try {
    if (requestUrl.searchParams.get('to')) {
      toPubkey = new PublicKey(requestUrl.searchParams.get('to')!)
    }
  } catch (err) {
    throw 'Invalid input query parameter: to'
  }

  try {
    if (requestUrl.searchParams.get('amount')) {
      amount =
        parseFloat(requestUrl.searchParams.get('amount')!) * LAMPORTS_PER_SOL
    }

    if (amount <= 0) throw 'amount is too small'
  } catch (err) {
    throw 'Invalid input query parameter: amount'
  }

  try {
    if (!requestUrl.searchParams.get('blink'))
      throw "input query 'blink' not found"

    blink_id = requestUrl.searchParams.get('blink')!
  } catch (error) {
    throw 'Invalid input query parameter: amount'
  }

  try {
    if (requestUrl.searchParams.get('token')) {
      token = requestUrl.searchParams.get('token')!
    }
  } catch (err) {
    throw 'Invalid input query parameter: to'
  }

  return {
    amount,
    toPubkey,
    blink_id,
    token,
  }
}
