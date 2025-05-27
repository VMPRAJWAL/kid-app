
import React from 'react';

interface CloudProps {
  style?: React.CSSProperties;
  className?: string;
}

const Cloud: React.FC<CloudProps> = ({ style, className }) => {
  return (
    <div
      className={`absolute bg-white rounded-full ${className}`}
      style={{ ...style, filter: 'opacity(0.8)' }}
    >
      <div className="absolute bg-white rounded-full w-1/2 h-1/2 -top-1/4 left-1/4"></div>
      <div className="absolute bg-white rounded-full w-3/5 h-3/5 -bottom-1/4 left-1/10"></div>
      <div className="absolute bg-white rounded-full w-3/5 h-3/5 -bottom-1/4 right-1/10"></div>
    </div>
  );
};

export default Cloud;
