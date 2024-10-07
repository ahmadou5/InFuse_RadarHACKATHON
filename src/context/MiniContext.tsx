'use client'
import { ReactChildrenProps } from "@/interfaces";
import { createContext, useContext, useState } from "react";
//import { Dispatch, SetStateAction } from "react";
import { MiniContextType } from "@/interfaces";
const MiniContext = createContext<MiniContextType>({
    solBalance: 0,
    isCompressed: false,
    isLoading: false,
    setIsLoading: () => {},
    setIsCompressed: () => {},
    setSolBalance: () => {},
  })



export const MiniContextProvider = ({children}:ReactChildrenProps) => {
    const [solBalance,setSolBalance] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isCompressed,setIsCompressed] = useState<boolean>(false)
    const value:MiniContextType = {
       solBalance,
       isCompressed,
       isLoading,
       setIsLoading,
       setIsCompressed,
       setSolBalance
    }
    return (
        <MiniContext.Provider value={value}>
            {children}
        </MiniContext.Provider>
    )
}


export const useMini = () => useContext(MiniContext)