import { TokenView } from "@/views/TokenView"
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'


export default function Page({ params }:{ params: Params}) {
    return ( 
    <div className="min-h-screen">
      <TokenView slug={params.slug}/>
   </div>)  
  }