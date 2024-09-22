import React from 'react';
import { ChevronDown, Settings, Send, CreditCard, Plus } from 'lucide-react';
interface TokenCardProps {
    icon: string;
    name: string;
    amount: string;
    value: string;
    price: string;
  }

const TokenCard: React.FC<TokenCardProps> = ({ icon, name, amount, value, price }) => (
  <div className="bg-white/10 w-full mb-2 flex items-center justify-between rounded-2xl p-4">
    <div className="flex items-center">
      <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
        <img src={icon} alt={name} className="w-8 h-8" />
      </div>
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="text-sm text-gray-400">{amount}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-white">${value}</p>
      <p className="text-sm text-gray-400">${price}</p>
    </div>
  </div>
);

export const WalletViewim = () => {
  const tokens = [
    { icon: "https://solana-wallet-orcin.vercel.app/assets/5426.png", name: "Solana", amount: "2 SOL", value: "300", price: "60" },
    { icon: "https://solana-wallet-orcin.vercel.app/assets/5426.png", name: "Solana", amount: "233 SOL", value: "30", price: "20" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img src="https://solana-wallet-orcin.vercel.app/assets/5426.png" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
          <ChevronDown size={24} className="text-gray-400" />
        </div>
        <Settings size={24} className="text-gray-400" />
      </div>

      <div className="text-center mb-10">
        <p className="text-gray-400 mb-2">Total Balance</p>
        <h1 className="text-5xl font-bold mb-4">$399</h1>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 flex items-center">
            <Send size={18} className="mr-2" /> Send
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-full px-6 py-2 flex items-center">
            <CreditCard size={18} className="mr-2" /> Receive
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Balances</h2>
      {tokens.map((token, index) => (
        <TokenCard key={index} {...token} />
      ))}

      <button className="w-full bg-white/10 hover:bg-white/20 text-blue-400 rounded-full py-3 mt-4 flex items-center justify-center">
        <Plus size={18} className="mr-2" /> Add Custom Token
      </button>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex justify-around">
        <button className="text-gray-400 hover:text-white">Wallet</button>
        <button className="text-gray-400 hover:text-white">Swap</button>
        <button className="text-gray-400 hover:text-white">NFTs</button>
        <button className="text-gray-400 hover:text-white">History</button>
      </nav>
    </div>
  );
};