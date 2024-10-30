import { UserInterface } from ".";
import { Dispatch, SetStateAction } from "react";
import { Network } from "./models.interface";

export interface AuthContextProps {
  isLoggedIn: boolean;
  user: UserInterface | undefined; // Allow undefined
  setUser: (user: UserInterface) => void;
  logout: () => void;
  fetchProfile: (userId: number) => void;
  isUserLoading: boolean;
}

export interface MiniContextType {
  solBalance: number;
  isCompressed: boolean;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsCompressed: Dispatch<SetStateAction<boolean>>;
  setSolBalance: Dispatch<SetStateAction<number>>;
}

export interface AppContextProps {
  userBalance: number;
  //setUserBalance: () => Dispatch<SetStateAction<number>>
}

export interface NetworkContextType {
  isActive: boolean;
  network: Network;
  setActiveChain: (network: Network) => void;
}
