
export const Loading = () => {
    return(
    <div className="inset-0 fixed bg-black bg-opacity-100 w-[100%] z-[99999999] min-h-screen h-auto backdrop-blur-sm flex ">
        <div className="w-[100%] h-[auto] flex items-center justify-center">
           <div className="w-auto h-auto mt-4">
            <img src='https://solana-wallet-orcin.vercel.app/assets/show.png' className="w-[200px] h-[200px]" />
           </div>
        </div>
    </div>
    )
}

