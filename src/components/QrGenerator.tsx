import React from 'react';
import  { QRCodeSVG } from 'qrcode.react'

interface CustomQRCodeProps {
  value: string|undefined;
  logo: string;
  size?: number;
}

export const CustomQRCode: React.FC<CustomQRCodeProps> = ({ value, logo, size = 256 }) => {

  const qrValue = value || 'no data';
  return (
    <div className="relative inline-block">
      <QRCodeSVG
        value={qrValue}
        size={size}
        baseFrequency={300}
        
        
        //renderAs="svg"
        imageSettings={{
          src: logo,
          x: undefined,
          y: undefined,
          height: size * 0.2,
          width: size * 0.2,
          excavate: true,
        }}
      />
    </div>
  );
};
