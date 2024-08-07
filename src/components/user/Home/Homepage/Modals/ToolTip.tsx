import React, { ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative flex items-center group ">
      {children}
      <div className="group-hover:block absolute hidden z-10 top-[105%] left-1/2 transform -translate-x-1/2 mt-2 w-[50vh] whitespace-normal ">
        <div className=" relative bg-white border  text-gray-800 shadow-top text-xs rounded py-3 px-3 opacity-0 group-hover:opacity-100 group-hover:shadow-2xl group-hover:shadow-black  transition-opacity duration-100 ">
          {text}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[-10px] w-0 h-0 border-x-[10px] border-x-transparent border-b-[8px] border-b-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
