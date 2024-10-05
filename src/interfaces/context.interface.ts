import { UserInterface } from '.'
//import { Dispatch, SetStateAction } from 'react';

export interface AuthContextProps {
  isLoggedIn: boolean;
  user: UserInterface | undefined;  // Allow undefined
  setUser: (user: UserInterface) => void;
  logout: () => void;
  fetchProfile: (userId: number) => void;
  isUserLoading: boolean;
}

export interface AppContextProps {
  userBalance: number;
  //setUserBalance: () => Dispatch<SetStateAction<number>>
}
