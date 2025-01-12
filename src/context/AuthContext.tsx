'use client';

import {
  AuthContextProps,
  ReactChildrenProps,
  UserInterface,
} from '@/interfaces';
import { useInitData } from '@telegram-apps/sdk-react';
import CookiesService from '@/lib/cookie.lib';
import { UserService } from '@/lib/services/user.service';
import { COOKIE_USER_DATA_KEY } from '@/lib/constant/app.constant';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';

const initialAuthState: AuthContextProps = {
  isLoggedIn: false,
  user: undefined,
  setUser: () => {},
  logout: () => {},
  fetchProfile: () => {},
  isUserLoading: true,
};

export const AuthContext = createContext<AuthContextProps>(initialAuthState);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthContextProvider({ children }: ReactChildrenProps) {
  const router = useRouter();
  const tgData = useInitData();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInterface | undefined>(undefined);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setIsUserLoading(true);

      if (tgData?.user?.id) {
        await fetchProfile(tgData.user.id);
      } else {
        setIsUserLoading(false);
      }
    };
    setTimeout(() => {
      initAuth();
    }, 1000);
  }, [tgData]);

  const logout = () => {
    CookiesService.remove(COOKIE_USER_DATA_KEY);
    setIsLoggedIn(false);
    setUser(undefined);
    router.replace('/create');
  };

  const handleSetUser = (userData: UserInterface) => {
    CookiesService.setter(COOKIE_USER_DATA_KEY, userData);
    setUser(userData);
    setIsLoggedIn(true);
    setIsUserLoading(false);
  };

  const fetchProfile = async (userId: number) => {
    try {
      const getUser = await UserService.GetUserByID(userId);

      if (!getUser.success) {
        setIsUserLoading(false);
        router.replace('/create');
        return;
      }

      handleSetUser(getUser.data);
      router.replace('/wallet');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsUserLoading(false);
      logout();
    }
  };

  const AuthContextValue: AuthContextProps = {
    isLoggedIn,
    user,
    setUser: handleSetUser,
    logout,
    fetchProfile,
    isUserLoading,
  };

  return (
    <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
