"use client";
import { COOKIE_NETWORK_DATA_KEY } from "@/lib/constant/app.constant";
import { NetworkContextType, ReactChildrenProps } from "@/interfaces";
import { Network } from "@/interfaces/models.interface";
//import { ENV } from "@/lib/constant/env.constant";
import CookiesService from "@/lib/cookie.lib";
import { createContext, useContext, useState, useEffect } from "react";
import { NetworkServices } from "@/lib/services/Network.service";
import { networkList } from "@/utils/networks.utils";
const initialNetworkState: NetworkContextType = {
  isActive: false,
  network: networkList[0],
  setActiveChain: (network: Network) => console.log(network),
};

export const NetworkContext =
  createContext<NetworkContextType>(initialNetworkState);

export const useNetwork = () => {
  return useContext(NetworkContext);
};

export default function NetworkContextProvider({
  children,
}: ReactChildrenProps) {
  const [network, setNetwork] = useState<Network>();
  useEffect(() => {
    const initNetwork = async () => {
      const savedNetwork = await CookiesService.getNetwork(
        COOKIE_NETWORK_DATA_KEY
      );
      if (savedNetwork) {
        handleSetNetwork(savedNetwork);
      }
      fetchNetwork();
    };
    initNetwork();
  }, []);
  const handleSetNetwork = (network: Network) => {
    CookiesService.setter(COOKIE_NETWORK_DATA_KEY, network);
    setNetwork(network);
  };

  const fetchNetwork = async () => {
    try {
      const solana = await NetworkServices.getSolana();
      if (!solana) {
        setNetwork(undefined);
      }
      console.log(solana);
      setNetwork(solana);
    } catch (error) {
      console.log(error);
    }
  };
  const NetworkContextValue: NetworkContextType = {
    isActive: true,
    network: {
      name: network?.name || "",
      native: network?.native || undefined,
      isTestNet: network?.isTestNet || false,
      isEVM: network?.isEVM || false,
      rpcUrl: network?.rpcUrl || "",
    },
    setActiveChain: handleSetNetwork,
  };
  return (
    <NetworkContext.Provider value={NetworkContextValue}>
      {children}
    </NetworkContext.Provider>
  );
}
