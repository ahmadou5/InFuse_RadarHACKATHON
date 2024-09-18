'use client'

import { AuthContextProps, ReactChildrenProps,UserInterface, } from "@/interfaces"
import {  useInitData } from "@telegram-apps/sdk-react"
import CookiesService from "@/lib/cookie.lib"
import { UserService } from "@/lib/services/user.service"
import { COOKIE_USER_DATA_KEY } from "@/lib/constant/app.constant"
import { useRouter } from "next/navigation"
import { createContext, useContext , useState, useEffect } from "react"

const initialAuthState: AuthContextProps = { 
    isLoggedIn: false,
    user: null,
    setUser:(user: any) => null ,
}

export const AuthContext = createContext<AuthContextProps>(initialAuthState)

export const useAuth = () => {
    return useContext(AuthContext)
}

export default function AuthContextProvider({children}:ReactChildrenProps) {
  const router = useRouter()
  const tgData = useInitData()

  const [isLoggedIn, setIsLoggedIn] = useState(false) //? isLoggedIn state
  const [user, setUser] = useState<UserInterface | null>(
    CookiesService.get<any>(COOKIE_USER_DATA_KEY)
  ) //? user state
  useEffect(() => {
    setIsLoggedIn(false)

    if (!user && isLoggedIn) logout()
    else fetchProfile()
  }, [])

 

  //? function to log a user out
  const logout = () => {
    // CookiesService.remover(COOKIE_TOKEN_KEY)
    CookiesService.remove(COOKIE_USER_DATA_KEY)
    setIsLoggedIn(false)
    setUser(null)
    router.replace('/')
  }

  // ? function to set user to cookie and state
  const handleSetUser = (passedUser: any) => {
    const newUser = { ...user, ...passedUser }
    CookiesService.setter(COOKIE_USER_DATA_KEY, newUser)
    setUser(newUser)
  }

  const fetchProfile = async () => {
    try {
        if (tgData?.user?.id === undefined) {
          console.log('User ID is undefined');
          return;
        }
    
        const getUser = await UserService.GetUserByID(tgData.user.id);
        
        if (getUser.success) {
          console.log('User not found');
          router.replace('/create')
          return;
        }
        if (!getUser.success) {
            console.log('user', getUser.data);
            handleSetUser(getUser.data);
            router.replace('/fff')
          }
        
    
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    const AuthContextValue:AuthContextProps = {
       isLoggedIn,
       user,
       setUser,
    }
    return(
    <AuthContext.Provider value={AuthContextValue}>
       {children}
    </AuthContext.Provider>
    )
}