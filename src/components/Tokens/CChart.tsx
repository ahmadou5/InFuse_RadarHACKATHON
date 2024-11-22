import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { Tokens } from "@/interfaces/models.interface";
//import { TokenService } from "@/lib/services/TokenServices";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNetwork } from "@/context/NetworkContext";
import { Token } from "@/utils/tokens.utils";
//import { useRouter } from 'next/navigation';

interface ChartProps {
  tokenId: string;
}

interface ChartDataPoint {
  date: Date;
  price: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  tokenId: string;
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: ChartDataPoint;
  }>;
}
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  tokenId,
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/5 w-[150px] backdrop-blur-md p-2 rounded-2xl shadow-md">
        <p className="text-white">{`${tokenId}`}</p>
        <p className="text-white">{`$${payload[0].value.toFixed(7)}`}</p>
        <p className="text-white text-xs">
          {new Date(payload[0].payload.date).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const fetchTokenData = async (tokenId: string, timeframe: string) => {
  const baseUrl = "https://api.coingecko.com/api/v3";
  const days =
    timeframe === "1H"
      ? 1
      : timeframe === "1D"
      ? 1
      : timeframe === "1W"
      ? 7
      : timeframe === "1M"
      ? 30
      : 365;
  const url = `${baseUrl}/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.prices.map(([timestamp, price]: [number, number]) => ({
      date: new Date(timestamp),
      price: price,
    }));
  } catch (error) {
    // console.error("Error fetching token data:", error);
    return [];
  }
};

const CChart = ({ tokenId }: ChartProps) => {
  const [timeframe, setTimeframe] = useState("1D");
  const [chartData, setChartData] = useState<{ date: Date; price: number }[]>(
    []
  );
  const [tokenInfo, setTokenInfo] = useState<Tokens[]>([]);
  const { network } = useNetwork();
  const getTokenInfo = async (slug: string) => {
    try {
      // setIsLoading(true);
      // console.log('Fetching token info for slug:', slug);
      const response = Token.filter((token) => token.compress_address === slug);
      //console.log('Token info response:', response);

      if (response && Array.isArray(response)) {
        setTokenInfo(response);
        //  console.log("Token info set:", response);
        const data = await fetchTokenData(tokenInfo[0]?.token_id, timeframe);
        setChartData(data);
        return response;
      } else {
        //   console.error("Invalid token data received:", response);
        setTokenInfo([]);
      }
    } catch (error) {
      //console.error("Failed to fetch tokens:", error);
      setTokenInfo([]);
    } finally {
      //    setIsLoading(false);
      //alert('done')
    }
  };
  useEffect(() => {
    getTokenInfo(tokenId[1]);
  }, [tokenId[1], timeframe]);

  const currentPrice = useMemo(
    () => chartData[chartData.length - 1]?.price || 0,
    [chartData]
  );
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    return currentPrice - chartData[0].price;
  }, [chartData, currentPrice]);
  //console.log(tokenInfo, "gggggggggggggggggggg");
  const priceChangePercentage = useMemo(() => {
    if (chartData.length < 2) return 0;
    return (priceChange / chartData[0].price) * 100;
  }, [chartData, priceChange]);

  return (
    <div className="bg-white/0 w-[96%] mt-2 ml-auto mr-auto py-1 px-2 rounded-lg ">
      <div className="flex justify-between ml-2 mr-2 items-baseline mb-8">
        <span className="text-2xl  font-bold">{`$ ${currentPrice.toFixed(
          7
        )}`}</span>
        <span
          className={`flex items-center ${
            priceChange >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {priceChange >= 0 ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownRight size={16} />
          )}
          ${Math.abs(priceChange).toFixed(2)} (
          {Math.abs(priceChangePercentage).toFixed(2)}%)
        </span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            content={
              <CustomTooltip
                tokenId={
                  tokenId[0] === network.native?.name.toLowerCase()
                    ? `c${network.native.name}`
                    : `c${tokenInfo[0]?.name}`
                }
              />
            }
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={priceChange >= 0 ? "#22c55e" : "#ef4444"}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        {["1D", "1W", "1M", "1Y"].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`${timeframe === tf ? "font-bold" : ""}`}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CChart;
