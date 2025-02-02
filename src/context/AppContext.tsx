'use client';

import { AppContextProps, ReactChildrenProps } from '@/interfaces';

import { createContext, useContext, useState, useEffect } from 'react';

const initialAuthState: AppContextProps = {
  userBalance: 0,
};

export const AppContext = createContext<AppContextProps>(initialAuthState);

export const useApp = () => {
  return useContext(AppContext);
};

export default function AppContextProvider({ children }: ReactChildrenProps) {
  const [userBalance, setUserBalance] = useState<number>(0);

  useEffect(() => {
    setUserBalance(45);
  }, []);

  const AppContextValue: AppContextProps = {
    userBalance,
    // setUserBalance()
  };

  return (
    <AppContext.Provider value={AppContextValue}>
      {children}
    </AppContext.Provider>
  );
}
