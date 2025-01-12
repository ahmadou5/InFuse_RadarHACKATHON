//import { useAuth } from "@/context/AuthContext";

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { Toaster } from 'react-hot-toast';

//import { useRouter } from "next/navigation";
import { useMini } from '@/context/MiniContext';
export const CActivities = ({ slug }: Params) => {
  // const { user } = useAuth();
  const { setIsCompressed } = useMini();
  console.log(slug);
  // const router = useRouter();
  // const hanleCopy = (value: string) => {
  //  navigator.clipboard.writeText(value).then(
  //    () => {
  //      toast.success("Copied.Successfully");
  //     },
  //     (err) => {
  //       // Failed to copy to clipboard
  //      toast.error("Could not copy: ", err);
  //    }
  //   );
  // };

  {
    /**  const handleCompress = async () => {
        try {
          setIsLoading()
        } catch (error) {
          
        }
    }
    const HandleMint = () => {
      
      try {
        if(!user) {
          return
        }
        let userPubKey: PublicKey;
        try {
          userPubKey = new PublicKey(user.publicKey);
        } catch (error) {
          throw new Error("Invalid sender address");
        }
        getCompressTokenBalance({address: userPubKey })
      } catch (error) {
        console.log(error)
      }
    }*/
  }
  return (
    <div className="bg-gothic-300/0 w-[90%] ml-auto mr-auto mb-5 flex items-center justify-center rounded-3xl h-[100px]">
      <div>
        <button
          onClick={() => setIsCompressed(true)}
          className="text-3xl  bg-white/10 flex flex-col items-center justify-center rounded-3xl h-16 w-16 ml-auto mr-auto text-white/60"
        >
          <img src="/assets/decomp.svg" className="mt-1" />
        </button>
        <p className="text-sm mt-1">Decompress</p>
      </div>

      <Toaster />
    </div>
  );
};
