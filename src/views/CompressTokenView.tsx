"use client";

import { useMini } from "@/context/MiniContext";
import { Card } from "@/components/Tokens/Card";
import { CActivities } from "@/components/Tokens/Cactivities";
import { CTop } from "@/components/Tokens/CTop";
import CChart from "@/components/Tokens/CChart";
import { CTokenDetails } from "@/components/Tokens/CTokensDetails";
//import { Params } from "next/dist/shared/lib/router/utils/route-matcher"

export const CompressTokenView = ({ slug }: { slug: string }) => {
  const { isCompressed } = useMini();
  return (
    <div>
      <CTop tokenId={slug} />
      {/**compress activity */}
      <CActivities slug={slug} />
      <CChart tokenId={slug} />
      <CTokenDetails tokenId={slug} tokenSymbol={slug} />
      {/**<Transactions tokenId={slug} /> **/}
      {isCompressed && <Card tokenId={slug} />}
    </div>
  );
};
