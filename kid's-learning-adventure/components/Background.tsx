
import React from 'react';
import Cloud from './Cloud';

const Background: React.FC = () => {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-600"></div>

      {/* Clouds */}
      <Cloud className="w-32 h-16 md:w-48 md:h-24 top-[10%] left-[15%]" />
      <Cloud className="w-24 h-12 md:w-36 md:h-18 top-[20%] left-[70%]" />
      <Cloud className="w-28 h-14 md:w-40 md:h-20 top-[5%] left-[40%]" />
      
      {/* Decorative elements (simplified) */}
       <div className="absolute bottom-20 left-10 w-16 h-20 ">
        {/* Simple Apple Tree representation */}
        <div className="absolute bottom-0 w-6 h-12 bg-yellow-700 rounded-t-md left-1/2 transform -translate-x-1/2"></div>
        <div className="absolute top-0 w-16 h-16 bg-green-600 rounded-full transform -translate-x-1/2 left-1/2"></div>
        <div className="absolute top-4 left-2 w-4 h-4 bg-red-500 rounded-full"></div>
        <div className="absolute top-2 left-8 w-4 h-4 bg-red-500 rounded-full"></div>
      </div>

      <div className="absolute bottom-10 right-12 w-12 h-10">
        {/* Simple Bush representation */}
        <div className="w-full h-full bg-green-700 rounded-t-full"></div>
      </div>

      {/* Grass */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-green-500">
        <div className="absolute -top-4 left-0 right-0 h-8 bg-green-600 rounded-t-full opacity-50"></div>
      </div>
    </div>
  );
};

export default Background;
