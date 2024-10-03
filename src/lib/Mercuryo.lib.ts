import { ENV } from "./constant/env.constant";
const baseUrl = 'https://exchange.mercuryo.io/?'

export const GeneratePayLink = ({tokenName, amount}:{
    tokenName:string;
    amount:number
}) => {
   try {
    const full = `${baseUrl}${ENV.WIDGET_ID}&amount=${amount}&currency=${tokenName}&network=SOLANA`
    console.log(tokenName)
    console.log(amount,full)
   } catch (error) {
    
   }
}

//https://exchange.mercuryo.io/?062b011a-cad3-4890-85cb-c43f53dff6ea&amount=20&currency=usdt&network=SOLANA