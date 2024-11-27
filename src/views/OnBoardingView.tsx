"use client";
import { useInitData } from "@telegram-apps/sdk-react";
import { createSolanaWallet } from "@/lib/solana.lib";
import { createEthAccount } from "@/lib/eth.lib";
import { UserService } from "@/lib/services/user.service";
import React, { useState, ChangeEvent } from "react";
import { GenerateSeed, SeedGenerationResult } from "@/lib/helper.lib";
import { ArrowRight, ArrowLeft, MailCheckIcon, LockOpen } from "lucide-react";
//import { SpinningCircles } from "react-loading-icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createSuiWallet } from "@/lib/sui.lib";
import { createTonAccount } from "@/lib/ton.lib";
import toast, { Toaster } from "react-hot-toast";

interface FormData {
  email: string;
  pin: string;
}

interface FormErrors {
  email?: string;
  pin?: string;
}
export const OnboardView = () => {
  const [isGetStart, setGetStart] = useState<boolean>(true);
  const [isSecond, setIsSecond] = useState<boolean>(false);
  const [isThird, setIsThird] = useState<boolean>(false);
  ////const [isNew, setIsNew] = useState<boolean>(false);
  //const [isLoading, setIsLoading] = useState<boolean>(false);
  const [created, setIsCreated] = useState<boolean>(false);
  const tgData = useInitData();
  const router = useRouter();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    pin: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  //
  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "pin") {
      setFormData((prev) => ({ ...prev, [name]: value.slice(0, 4) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid Gmail address";
    }

    if (!formData.pin) {
      newErrors.pin = "PIN is required";
    } else if (formData.pin.length !== 4) {
      newErrors.pin = "PIN must be exactly 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      if (formData.email === "") {
        //setIsNew(true);
      } else {
        console.log("Form submitted:", formData);
        // Proceed with user creation
        setGetStart(false);
        setIsSecond(false);
        setIsThird(true);
      }
    }
  };

  const handleSubmit2 = async () => {
    if (tgData?.user?.id === undefined) {
      console.log("User ID is undefined");
      return;
    }
    const { mnemonic, seedArray }: SeedGenerationResult = await GenerateSeed();
    //setIsLoading(true);
    const EthAccount = await createEthAccount(mnemonic);
    const suiAccount = await createSuiWallet(mnemonic);
    const tonAccount = await createTonAccount(mnemonic);
    const solWalletInfo = await createSolanaWallet(seedArray);
    const upload = UserService.CreateUser({
      user_id: tgData.user.id,
      email: formData.email,
      username: tgData.user.firstName,
      pin: formData.pin,
      solPrivateKey: solWalletInfo?.secret,
      solPublicKey: solWalletInfo?.publicKey,
      ethAddress: EthAccount.address,
      ethPrivateKey: EthAccount.privateKey,
      suiAddress: suiAccount.address,
      suiPrivateKey: suiAccount.privateKey,
      tonPrivateKey: tonAccount.secret,
      tonPublicKey: tonAccount.public1,
      mnemonic: mnemonic,
    });
    console.log(upload, "created");
    if ((await upload).success) {
      setIsCreated(true);
      toast.success("Wallet Creation Success!", {
        style: {
          display: "ruby-base",
        },
      });
      //setIsLoading(false);
      setUser((await upload).data);
      console.log("user", (await upload).data);
    }
  };
  //const router = useRouter()
  return (
    <div className="w-[100%]">
      {isGetStart && (
        <>
          <div className="w-[100%] mt-4 flex flex-col p-5 h-[100%]">
            <div className="mt-[98px] w-[100%] flex flex-col items-start justify-start">
              <div className="text-[25px] ml-auto mr-3 font-light w-[100%]">
                Welcome to
                <p className="text-blue-800 text-4xl font-light">
                  InFuse Wallet
                </p>
              </div>
              <div className="flex w-[100%] mt-10 py-2 px-4 h-[100px]  bg-white/10 bg-opacity-90 rounded-xl">
                <div className="h-[100%] flex items-center justify-center w-[30%]">
                  <LockOpen className="text-blue-800/55 w-14 h-14" />
                </div>
                <div className="h-[100%] flex flex-col items-start justify-center px-4">
                  <p className="text-white text-[16px] mb-1">
                    Simple and Secured
                  </p>
                  <p className="text-white/65 text-sm">
                    Web3 On Your Familiar Enviroment. Secured & Simplified.
                  </p>
                </div>
              </div>
              <div className="flex w-[100%] py-2 px-4 mt-5 h-[100px] bg-white/10 bg-opacity-90 rounded-xl">
                <div className="h-[100%] flex  items-center justify-center w-[30%]">
                  <MailCheckIcon className="text-blue-800/55 w-14 h-14" />
                </div>
                <div className="h-[100%] flex flex-col items-start justify-center px-4">
                  <p className="text-white text-[16px] mb-1">Social Recovery</p>
                  <p className="text-white/65 text-sm">
                    Easily Recover Your Account Using Your Email Account.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[90px] w-[100%] flex flex-col items-center justify-center">
              <div
                onClick={() => {
                  setIsSecond(true);
                  setIsThird(false);
                  setGetStart(false);
                }}
                className="w-16 rounded-full ml-auto mr-auto text-black/85 flex items-center justify-center py-1 border border-white/40 bg-blue-800 h-16"
              >
                {/** <p className="ml-4 text-lg mr-auto">Get Started</p>**/}
                <ArrowRight className=" h-6 w-6 text-white/70" />
              </div>
            </div>
          </div>
        </>
      )}
      {isSecond && (
        <>
          <div className="w-[100%] max-h-screen py-3">
            <div className=" bg-slate-50/0 mb-[50px] w-[100%] flex flex-col ">
              <div
                onClick={() => {
                  setGetStart(true);
                  setIsSecond(false);
                  setIsThird(false);
                }}
                className="bg-white/0 flex items-center justify-center w-14 rounded-xl ml-1 h-8"
              >
                <ArrowLeft className="font-bold text-xl" />
              </div>
            </div>

            <div className="w-[100%] bg-white/5 mt-[120px] py-5 flex-col items-center justify-center rounded-t-3xl">
              <div className="flex items-center ml-auto mr-auto justify-center h-[155px] w-[155px]">
                <img
                  src="/assets/show.png"
                  className="w-[90%] h-[90%] rounded-full"
                />
              </div>
              <div className="ml-auto mr-auto mt-[5px] h-9 flex items-center justify-center  rounded-md w-[93%]">
                <p>Hey Lets Get Your Recovery Details</p>
              </div>
              <div className="max-w-md mx-auto w-[93%] mt-[24px] h-auto py-4 px-4 mb-10 bg-white/0 bg-opacity-20 rounded-lg ">
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm ml-3 font-medium text-white/75"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your Email address"
                      className="mt-1 block w-full px-3 py-3 bg-black/40  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="pin"
                      className="block ml-3 text-sm font-medium text-white/75"
                    >
                      PIN
                    </label>
                    <input
                      type="tel"
                      id="pin"
                      name="pin"
                      value={formData.pin}
                      onChange={handleInputChange}
                      placeholder="Create 4-digit PIN"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      security="yes"
                      maxLength={4}
                      className="mt-1 block w-full px-3 py-4  bg-black/40 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.pin && (
                      <p className="mt-2 text-sm text-red-600">{errors.pin}</p>
                    )}
                  </div>
                  {
                    <div className="w-[100%] flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                        type="submit"
                        className="w-14 rounded-full ml-auto mr-auto py-0 text-black border border-[#448cff]/60 flex items-center justify-center bg-white/90 h-14 mt-1"
                      >
                        <ArrowRight className="" />
                      </button>
                    </div>
                  }
                </form>
              </div>
            </div>
          </div>
        </>
      )}
      {isThird && (
        <>
          <div className="max-h-screen w-[100%] py-10">
            <div className=" flex items-center justify-center h-[12] mb-[230px] w-[100%]  "></div>

            <div className="w-[100%] flex items-center justify-center mt-12 h-[210px]">
              <div className="flex bg-black15 rounded-lg bg-opacity-30">
                <img src={"./assets/show.png"} alt="Omo" />
              </div>
            </div>
            <div className="mt-24 w-[90%] ml-auto mr-auto flex items-center justify-center">
              {created ? (
                <div
                  onClick={() => {
                    router.push("/wallet");
                  }}
                  className="w-[99%] ml-auto mr-auto flex items-center justify-center h-12 rounded-2xl bg-white/80"
                >
                  <p className="ml-auto mr-auto text-black"> Continue</p>
                </div>
              ) : (
                <div
                  onClick={() => handleSubmit2()}
                  className="w-[98%] ml-auto mr-auto py-1 border border-[#448cff]/60 rounded-xl bg-black/50 h-14 flex items-center"
                >
                  <p className="ml-auto mr-auto"> Create New Wallet</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <Toaster />
    </div>
  );
};
