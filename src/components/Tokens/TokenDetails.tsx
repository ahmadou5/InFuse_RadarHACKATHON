import { useState, useEffect } from "react";
import { Tokens } from "@/interfaces/models.interface";
import { TokenService } from "@/lib/services/TokenServices";
interface TokenProps {
  tokenId: string;
  tokenSymbol: string;
}
export const TokenDetails = ({ tokenId }: TokenProps) => {
  const [tokenInfo, setTokenInfo] = useState({
    currentPrice: 0,
    priceChange24h: 0,
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
  });
  const [token1Info, setToken1Info] = useState<Tokens[]>([]);
  
  const getTokenInfo = async (slug: string) => {
    try {
      //console.log("token etails");
      const response = await TokenService.getTokenBytoken_id(slug);

      if (response.data && Array.isArray(response.data)) {
        setToken1Info(response.data);
        //console.log(response, "anan ne");
      } else {
        console.error("Invalid token data received:", response);
        setToken1Info([]); // Set to empty array if data is invalid
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      setToken1Info([]); // Set to empty array on error
    }
  };
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
  };
  useEffect(() => {
    const fetchTokenInfo = async () => {
      const url = `https://api.coingecko.com/api/v3/coins/${tokenId}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setTokenInfo({
          currentPrice: data.market_data.current_price.usd,
          priceChange24h: data.market_data.price_change_percentage_24h,
          marketCap: data.market_data.market_cap.usd,
          volume24h: data.market_data.total_volume.usd,
          circulatingSupply: data.market_data.circulating_supply,
        });
      } catch (error) {
        console.error("Error fetching token info:", error);
      }
    };

    fetchTokenInfo();
    getTokenInfo(tokenId)
  }, [tokenId]);
  return (
    <div className="w-[100%]">
      {/* Token Stats */}
      <div className="flex ml-auto mr-auto w-[93%] mt-8 mb-8">
        <div className="bg-white/  bg-opacity-10 ml-auto mr-auto w-[100%] rounded-xl p-2">
          <h3 className="text-lg font-semibold mb-4">Token Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap</span>
              {tokenInfo.marketCap === undefined ? (
                <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
              ) : (
                <span>{`$${formatNumber(tokenInfo.marketCap)}`}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h Volume</span>
              {tokenInfo.volume24h === undefined ? (
                <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
              ) : (
                <span>{`$${formatNumber(tokenInfo.volume24h)}`}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Circulating Supply</span>
              {tokenInfo.volume24h === undefined ? (
                <div className="bg-white/20 h-4 w-16 mb-2 animate-pulse rounded"></div>
              ) : (
                <span>
                  {`${formatNumber(tokenInfo.circulatingSupply)}`} {tokenId[0] === 'solana' ? 'SOL' : token1Info[0]?.ticker}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
