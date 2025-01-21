import { WalletView } from "@/views/WalletView";

export default function Wallet() {
  return (
    <div
      className={`flex min-h-screen bg-[#448cff] bg-black/0 flex-col items-center justify-between p-1.5`}
    >
      <WalletView />
    </div>
  );
}
