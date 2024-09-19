'use client'

import { AuthContextProps, ReactChildrenProps, UserInterface } from "@/interfaces"
import { useInitData } from "@telegram-apps/sdk-react"
import { UserService } from "@/lib/services/user.service"
import { useRouter } from "next/navigation"
import { createContext, useContext, useState, useEffect } from "react"

const initialAuthState: AuthContextProps = { 
    isLoggedIn: false,
    user: undefined,
    setUser: (user: UserInterface) => { console.log(user)},
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
  const [user, setUser] = useState<UserInterface | undefined>(undefined)
  const [isUserLoading, setIsUserLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      setIsUserLoading(true)
      if (tgData?.user?.id) {
        await fetchProfile(tgData.user.id)
      } else {
        setIsUserLoading(false)
      }
    }

    initAuth()
  }, [tgData])

  const logout = () => {
    setIsLoggedIn(false)
    setUser(undefined)
    router.replace('/create')
  }

  const handleSetUser = (userData: UserInterface) => {
    setUser(userData)
    setIsLoggedIn(true)
    setIsUserLoading(false)
  }

  const fetchProfile = async (userId: number) => {
    try {
      const getUser = await UserService.GetUserByID(userId)
      
      if (!getUser.success) {
        console.log('User not found')
        setIsUserLoading(false)
        router.replace('/create')
        return
      }

      console.log('User found:', getUser.data)
      handleSetUser(getUser.data)
      router.replace('/')
    } catch (error) {
      console.error('Error fetching user data:', error)
      setIsUserLoading(false)
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