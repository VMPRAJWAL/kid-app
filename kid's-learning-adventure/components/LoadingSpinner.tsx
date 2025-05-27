
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      <p className="ml-4 text-xl text-purple-700 font-semibold">Loading an exciting puzzle...</p>
    </div>
  );
};

export default LoadingSpinner;
