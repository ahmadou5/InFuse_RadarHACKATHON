import { useMini } from "@/context/MiniContext"

export const Card = ({tokenId}:{tokenId: string}) => {
    const { setIsCompressed} = useMini()
    return(
    <div className="w-[100%] min-h-screen flex items-center justify-center inset-0 bg-opacity-100 z-[99999999] h-auto backdrop-blur-sm fixed">
        <div className="h-[300px] rounded  w-[90%] bg-white/80">
            {tokenId[0]}
           <button onClick={() => setIsCompressed(false)}>Close</button>
        </div>
    </div>
)
}

