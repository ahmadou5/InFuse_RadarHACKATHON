'use client'
import Chart from "@/components/Tokens/Chart";
import { Activities } from "@/components/Tokens/Activities";
import { TokenDetails } from "@/components/Tokens/TokenDetails";
import { Transactions } from "@/components/Tokens/Transactions";
import { Top } from "@/components/Tokens/Top";
//import { Params } from "next/dist/shared/lib/router/utils/route-matcher"








export const TokenView = ({slug}:{slug:string}) => {
    return(
    <div>
      <Top tokenId={slug}/>
      <Activities slug={slug} />
      <Chart tokenId={slug} />
      <TokenDetails tokenId={slug} tokenSymbol={slug} />
      <Transactions />
     {slug}
    </div>
    )
} 