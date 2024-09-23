'use client'
import Chart from "@/components/Tokens/Chart";
import { Activities } from "@/components/Tokens/Activities";
import { TokenDetails } from "@/components/Tokens/TokenDetails";
import { Transactions } from "@/components/Tokens/Transactions";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"








export const TokenView = ({slug}:Params) => {
    return(
    <div>
      <Chart tokenId="solana" />
      <Activities slug={slug} />
      <TokenDetails tokenId="solana" tokenSymbol="SOL" />
      <Transactions />
     {slug}
    </div>
    )
} 