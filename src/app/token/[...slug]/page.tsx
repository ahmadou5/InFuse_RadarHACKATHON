import { CompressTokenView } from "@/views/CompressTokenView";
import { TokenView } from "@/views/TokenView";

export default function token({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  if (params.slug.length > 1) {
    return (
      <div>
        <CompressTokenView slug={params.slug} />
      </div>
    );
  } else
    return (
      <div className="min-h-screen">
        <TokenView slug={params.slug} />
      </div>
    );
}
