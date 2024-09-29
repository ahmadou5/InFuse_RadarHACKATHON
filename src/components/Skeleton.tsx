import React from 'react';

const SkeletonLoader: React.FC = () => (
  <div className="bg-white/10 w-[90%] mb-1.5 flex items-center justify-center rounded-xl h-[70px] animate-pulse">
    <div className="bg-gothic-600/85 w-12 h-12 ml-[23px] mr-[10px] rounded-full"></div>
    <div className="ml-[5px] flex-grow mr-auto px-3">
      <div className="bg-white/20 h-4 w-24 mb-2 rounded"></div>
      <div className="bg-white/20 h-4 w-32 rounded"></div>
    </div>
    <div className="ml-[10px] mr-4 px-3">
      <div className="bg-white/20 h-4 w-16 mb-2 rounded"></div>
      <div className="bg-white/20 h-4 w-20 rounded"></div>
    </div>
  </div>
);

export default SkeletonLoader;