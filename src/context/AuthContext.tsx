'use client'

import { AuthContextProps, ReactChildrenProps, UserInterface } from "@/interfaces"
import { useInitData } from "@telegram-apps/sdk-react"
import CookiesService from "@/lib/cookie.lib"
import { UserService } from "@/lib/services/user.service"
import { COOKIE_USER_DATA_KEY } from "@/lib/constant/app.constant"
import { useRouter } from "next/navigation"
import { createContext, useContext, useState, useEffect } from "react"

const initialAuthState: AuthContextProps = { 
    isLoggedIn: false,
    user: undefined,
    setUser: (user: UserInterface) => console.log(user),
    logout: () => {},
    isUserLoading: true,
}

export const AuthContext = createContext<AuthContextProps>(initialAuthState)

export const useAuth = () => {
    return useContext(AuthContext)
}

export default function AuthContextProvider({children}: ReactChildrenProps) {
  const router = useRouter()
  const tgData = useInitData()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserInterface | undefined>(
    CookiesService.get(COOKIE_USER_DATA_KEY)
  )
  const [isUserLoading, setIsUserLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      setIsUserLoading(true)
      const savedUser = CookiesService.get(COOKIE_USER_DATA_KEY)
      if (savedUser) {
        setUser(savedUser)
        setIsLoggedIn(true)
      } else {
        await fetchProfile()
      }
      setIsUserLoading(false)
    }

    initAuth()
  }, [tgData])

  const logout = () => {
    CookiesService.remove(COOKIE_USER_DATA_KEY)
    setIsLoggedIn(false)
    setUser(undefined)
    router.replace('/create')
  }

  const handleSetUser = (passedUser: UserInterface) => {
    const newUser = { ...user, ...passedUser }
    CookiesService.setter(COOKIE_USER_DATA_KEY, newUser)
    setUser(newUser)
    setIsLoggedIn(true)
  }

  const fetchProfile = async () => {
    try {
      if (tgData?.user?.id === undefined) {
        console.log('User ID is undefined')
        return
      }

      const getUser = await UserService.GetUserByID(tgData.user.id)
      
      if (!getUser.success) {
        console.log('User not found')
        router.replace('/create')
        return
      }

      console.log('user found', getUser.data)
      handleSetUser(getUser.data)
      router.replace('/')
    } catch (error) {
      console.error('Error fetching user data:', error)
      logout()
    }
  }

  const AuthContextValue: AuthContextProps = {
    isLoggedIn,
    user,
    setUser: handleSetUser,
    logout,
    isUserLoading,
  }

  return (
    <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
  )
}