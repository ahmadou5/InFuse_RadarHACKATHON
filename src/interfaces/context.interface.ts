import { UserInterface } from '.'
import { Dispatch, SetStateAction } from 'react';

export interface TokenBalance {
  [address: string]: number
}


export interface TokenPrices {
  [ticker: string]: number;
}
export interface AuthContextProps {
  isLoggedIn: boolean;
  user: UserInterface | undefined;  // Allow undefined
  setUser: (user: UserInterface) => void;
  logout: () => void;
  fetchProfile: (userId: number) => void;
  isUserLoading: boolean;
}

export interface MiniContextType {
  solBalance: number|undefined;
  solPrice: number|undefined;
  isCompressed: boolean;
  isLoading: boolean;
  tokenBalance: TokenBalance
  tokenPrices: TokenPrices;
  setTokenBalance: Dispatch<SetStateAction<TokenBalance>>
  setTokenPrices: Dispatch<SetStateAction<TokenPrices>>
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsCompressed: Dispatch<SetStateAction<boolean>>;
  setSolBalance: Dispatch<SetStateAction<number>>;
  setSolPrice: Dispatch<SetStateAction<number>>;
}

export interface AppContextProps {
  userBalance: number;
  //setUserBalance: () => Dispatch<SetStateAction<number>>
}
