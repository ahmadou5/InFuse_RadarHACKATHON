import axios from "axios";
import { ENV } from "./constant/env.constant";
import crypto from "crypto";

const rateUrl = 'https://api.mercuryo.io/v1.6/public/rates?'
const baseUrl = "https://exchange.mercuryo.io?";

interface params {
  widget_id: string | undefined;
  type: string;
  currency: string;
  network: string;
  amount: string;
  fiat_currency: string;
  address: string;
  signature: string | undefined;
}

interface rateParams {
  widget_id: string | undefined;
  use_partner_fee: boolean;
  use_fee: boolean;
  flatten_result: boolean;
  is_amount_without_fee: boolean;
  network: string;
}

export const GeneratePayLink = ({
  tokenName,
  userAddress,
  amount,
  type,
}: {
  tokenName: string;
  amount: number;
  userAddress: string;
  type: string;
}) => {
  try {
    
    const secret = 'secret';

    // Generate the signature using sha512
    const signatureInput = `${userAddress}${secret}`;
    const signature = crypto.createHash('sha512').update(signatureInput).digest('hex');

    console.log(signature);

    const params: params = {
      widget_id: ENV.WIDGET_ID,
      type: type,
      currency: tokenName,
      network: "SOLANA",
      amount: amount.toString(),
      fiat_currency: "USD",
      address: userAddress,
      signature: signature,
    };

    const encodedParams = Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    const final:string = `${baseUrl}${encodedParams}`;

    console.log(tokenName);
    console.log(final, "asdfghj");
    return final;
  } catch (error) {
    console.log(error)
  }
};

//https://exchange.mercuryo.io/?062b011a-cad3-4890-85cb-c43f53dff6ea&amount=20&currency=usdt&network=SOLANA
export const getRate = async () => {
  try {
    const params:rateParams = {
        widget_id: ENV.WIDGET_ID,
        use_partner_fee: true,
        use_fee: true,
        flatten_result: true,
        is_amount_without_fee: true,
        network: 'SOLANA'
    }
    const encodedParams = Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    const price = await axios.get(`${rateUrl}?${encodedParams}`)
    console.log(price,'prices')
  } catch (error) {
    
  }
}


export const generateSignature = (publicKey: string) => {
  try {
    const secret = "showsss";

    const input = `${publicKey}${secret}`;
    const signature = crypto.createHash("sha512").update(input).digest("hex");

    console.log(signature);
    return signature;
  } catch (error) {
    console.log(error);
  }
};
