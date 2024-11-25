"use client";
import StyledQRCode from "@/components/QrGenerator";

import { Copy } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatAddress } from "@/lib/helper.lib";
export const ReceiveModal = () => {
  const router = useRouter();
  const { user } = useAuth();
  const hanleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(
      () => {
        toast.success("address copied");
      },
      (err) => {
        // Failed to copy to clipboard
        toast.error("Could not copy: ", err);
      }
    );
  };
  if (!user) {
    return;
  }

  return (
    <div className="inset-0 fixed bg-black bg-opacity-100 w-[100%] z-[99999999] min-h-screen h-auto backdrop-blur-sm flex ">
      <div className="w-[100%] py-4 px-4 bg-white/15/0 rounded-t-3xl h-auto mt-[20px]">
        <div className="mt-1 px-2 py-3 bg-red-600/0 h-[85%] flex flex-col rounded-xl w-[99%] ml-auto mr-auto">
          <div className="w-[100%] font-light text-[19px] mb-1 text-white text-center h-auto bg-slate-50/0 rounded-xl py-2 px-2">
            <p>
              Send SOL and SPL tokens only to this address, or you might lose
              your funds
            </p>
          </div>
          <div className="w-[98%] mt-16 ml-auto mr-auto h-[290px] py-3 px-2 flex flex-col items-center justify-center rounded-2xl bg-white/0">
            <div className="w-[100%] p-0 h-[100%] flex items-center justify-center">
              <StyledQRCode logo="/assets/show.png" data={user?.solPublicKey} />
            </div>
          </div>
          <div>
            <div className="mt-4 w-[100%] ml-auto mr-auto">
              <div className="mt-2 mb-2">
                <p className="text-white/80 text-center font-light ml-auto mr-auto ">
                  {formatAddress(user.solPublicKey)}
                </p>
              </div>
              <div
                onClick={() => hanleCopy(user.solPublicKey)}
                className="w-[50%] mb-5   ml-auto mr-auto py-1 mt-3 px-3 flex  items-center justify-center bg-black/80 rounded-full h-9"
              >
                <p className="text-white font-light text-[17px] ml-auto mr-1 ">
                  Copy
                </p>
                <Copy className="text-[17px] h-5 w-5 ml-1 mr-auto" />
              </div>
              <div className="mt-14">
                <div
                  onClick={() => router.back()}
                  className="w-[95%] mb-5   ml-auto mr-auto py-1 mt-3 px-3 flex  items-center justify-center bg-white/80 rounded-2xl h-12"
                >
                  <p className="text-black font-light text-[20px] ml-auto mr-auto ">
                    Close
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
