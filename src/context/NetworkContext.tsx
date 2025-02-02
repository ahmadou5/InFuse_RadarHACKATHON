'use client';
import { COOKIE_NETWORK_DATA_KEY } from '@/lib/constant/app.constant';
import { NetworkContextType, ReactChildrenProps } from '@/interfaces';
import { Network } from '@/interfaces/models.interface';
import CookiesService from '@/lib/cookie.lib';
import { createContext, useContext, useState, useEffect } from 'react';
import { NetworkServices } from '@/lib/services/Network.service';
import { networkList } from '@/utils/networks.utils';
const initialNetworkState: NetworkContextType = {
  isActive: false,
  network: networkList[0],
  setActiveChain: () => {},
};

export const NetworkContext =
  createContext<NetworkContextType>(initialNetworkState);

export const useNetwork = () => {
  return useContext(NetworkContext);
};

export default function NetworkContextProvider({
  children,
}: ReactChildrenProps) {
  const [network, setNetwork] = useState<Network | null>(null);
  useEffect(() => {
    const initNetwork = async () => {
      const savedNetwork = await CookiesService.getNetwork(
        COOKIE_NETWORK_DATA_KEY
      );
      if (savedNetwork) {
        handleSetNetwork(savedNetwork);
      } else {
        fetchNetwork();
      }
    };
    initNetwork();
  }, []);
  const handleSetNetwork = (network: Network) => {
    CookiesService.setter(COOKIE_NETWORK_DATA_KEY, network);
    setNetwork(network);
  };

  const fetchNetwork = async () => {
    try {
      const Networks = await NetworkServices.getAllNetworks();
      const solana = Networks?.filter(
        (n) => n.name === 'SOLANA' && n.isTestNet === false
      );
      if (!solana) {
        setNetwork(null);
      } else {
        handleSetNetwork(solana[0]);
        setNetwork(solana[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const NetworkContextValue: NetworkContextType = {
    isActive: true,
    network: {
      name: network?.name || '',
      native: network?.native || undefined,
      isTestNet: network?.isTestNet || false,
      isEVM: network?.isEVM || false,
      rpcUrl: network?.rpcUrl || '',
    },
    setActiveChain: handleSetNetwork,
  };
  return (
    <NetworkContext.Provider value={NetworkContextValue}>
      {children}
    </NetworkContext.Provider>
  );
}
