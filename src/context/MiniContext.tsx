'use client'
import { ReactChildrenProps } from "@/interfaces";
import { createContext, useContext, useState } from "react";


const MiniContext = createContext({})



export const MiniContextProvider = ({children}:ReactChildrenProps) => {
    const [solBalance,setSolBalance] = useState<number>(0)
    const value = {
       solBalance,
       setSolBalance
    }
    return (
        <MiniContext.Provider value={value}>
            {children}
        </MiniContext.Provider>
    )
}


export const useMini = () => useContext(MiniContext)