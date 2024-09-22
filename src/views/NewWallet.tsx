'use client'
import React from 'react';

interface Token {
  id: number;
  name: string;
  amount: number;
  value: number;
}

type TokenList = Token[];

const SvgIcon = ({ d, title }: { d: string, title: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>{title}</title>
    <path d={d} />
  </svg>
);

export default function NonCustodialWalletView2() {
  const tokens: TokenList = [
    { id: 1, name: 'Solana', amount: 2, value: 300 },
    { id: 2, name: 'SOL', amount: 233, value: 30 }
  ];


  return (
    <div className="w-full bg-gray-900/0 text-white min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center bg-blue-500 bg-opacity-15 border border-blue-400 border-opacity-45 rounded-xl p-2 w-1/2">
            <img src='/api/placeholder/24/24' alt="Solana" className="w-6 h-6 rounded-full mr-2" />
            <span className="font-semibold">SOLANA</span>
          </div>
          <div className="w-11 h-11 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
            <SvgIcon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" title="Shield" />
          </div>
        </div>
        
        {/* Wallet Security Status */}
        <div className="bg-green-500 bg-opacity-10 rounded-xl p-3 mb-4 flex items-center">
          <SvgIcon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" title="Shield" />
          <span className="text-sm ml-2">Wallet Secured</span>
        </div>

        {/* Total Balance */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400">Total Balance</p>
          <p className="text-5xl font-bold">$399</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-around mb-6">
          <button className="bg-blue-500 bg-opacity-10 rounded-xl p-3 text-center w-24 h-24 flex flex-col items-center justify-center">
            <SvgIcon d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" title="Send" />
            <p className="text-sm mt-2">Send</p>
          </button>
          <button className="bg-blue-500 bg-opacity-10 rounded-xl p-3 text-center w-24 h-24 flex flex-col items-center justify-center">
            <SvgIcon d="M22 12h-4l-3 9L9 3l-3 9H2" title="Receive" />
            <p className="text-sm mt-2">Receive</p>
          </button>
          <button className="bg-blue-500 bg-opacity-10 rounded-xl p-3 text-center w-24 h-24 flex flex-col items-center justify-center">
            <SvgIcon d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" title="Backup" />
            <p className="text-sm mt-2">Backup</p>
          </button>
        </div>
        
        {/* Seed Phrase Reminder */}
        <div className="bg-yellow-500 bg-opacity-10 rounded-xl p-3 mb-6">
          <p className="text-sm text-yellow-400 font-semibold mb-1">Seed Phrase Reminder</p>
          <p className="text-xs">Ensure your 12-word recovery phrase is securely stored offline.</p>
        </div>

        {/* Token Balances */}
        <h2 className="text-lg mb-4 text-gray-300 font-semibold">Balances</h2>
        
        {tokens.map((token) => (
          <div key={token.id} className="bg-blue-500 bg-opacity-10 rounded-xl p-4 mb-3 flex items-center">
            <img src={`/api/placeholder/48/48`} alt={token.name} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-grow">
              <p className="font-semibold">{token.name}</p>
              <p className="text-sm text-gray-400">{token.amount} {token.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${token.value}</p>
              <p className="text-sm text-gray-400">${(token.amount * token.value).toFixed(2)}</p>
            </div>
          </div>
        ))}
        
        {/* Add Custom Token Button */}
        <button className="text-blue-400 w-full text-center py-3 rounded-xl mb-4 text-sm font-semibold border border-blue-400 border-opacity-30">
          + Add Custom Token
        </button>

        {/* Export Private Key Warning */}
        <div className="bg-red-500 bg-opacity-10 rounded-xl p-3 mb-4">
          <p className="text-sm text-red-400 font-semibold mb-1">Security Warning</p>
          <p className="text-xs">Never share your private keys or seed phrase. Keep them secure and offline.</p>
        </div>
      </div>
    </div>
  );
}