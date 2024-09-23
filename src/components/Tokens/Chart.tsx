import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ChartProps {
  tokenId: string;
}

interface ChartDataPoint {
  date: Date;
  price: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: ChartDataPoint;
  }>;
}
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/10 backdrop-blur-md p-2 rounded shadow-md">
        <p className="text-white">SOL {payload[0].value.toFixed(2)}</p>
        <p className="text-white text-xs">{new Date(payload[0].payload.date).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const fetchTokenData = async (tokenId: string, timeframe: string) => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const days = timeframe === '1H' ? 1 : timeframe === '1D' ? 1 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : 365;
  const url = `${baseUrl}/coins/${tokenId}/market_chart?vs_currency=sgd&days=${days}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.prices.map(([timestamp, price]: [number, number]) => ({
      date: new Date(timestamp),
      price: price,
    }));
  } catch (error) {
    console.error('Error fetching token data:', error);
    return [];
  }
};

const Chart = ({ tokenId = "bitcoin" }: ChartProps) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState<{ date: Date; price: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTokenData(tokenId, timeframe);
      setChartData(data);
    };

    fetchData();
  }, [tokenId, timeframe]);

  const currentPrice = useMemo(() => chartData[chartData.length - 1]?.price || 0, [chartData]);
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    return currentPrice - chartData[0].price;
  }, [chartData, currentPrice]);

  const priceChangePercentage = useMemo(() => {
    if (chartData.length < 2) return 0;
    return (priceChange / chartData[0].price) * 100;
  }, [chartData, priceChange]);

  return (
    <div className="bg-white/0 w-[96%] mt-10 ml-auto mr-auto p-4 rounded-lg ">
      <div className="flex justify-between items-baseline mb-4">
        <span className="text-2xl  font-bold"> SOL {currentPrice.toFixed(2)}</span>
        <span className={`flex items-center ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {priceChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          SOL {Math.abs(priceChange).toFixed(2)} ({Math.abs(priceChangePercentage).toFixed(2)}%)
        </span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
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
        {[ '1D', '1W', '1M', 'All'].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`${timeframe === tf ? 'font-bold' : ''}`}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chart;