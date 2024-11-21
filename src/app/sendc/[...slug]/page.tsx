import { SendCView } from "@/views/SendCView";
//import { SendView } from "@/views/SendView";
//import { TokenView } from "@/views/TokenView"

export default function token({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  return (
    <div className="min-h-screen">
      <SendCView slug={params.slug} />
    </div>
  );
}
