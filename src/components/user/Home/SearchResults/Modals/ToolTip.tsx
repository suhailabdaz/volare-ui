import React, { ReactNode, useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Toggle the tooltip on click
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Close the tooltip when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center" ref={tooltipRef}>
      <div onClick={handleToggle} className="cursor-pointer">
        {children}
      </div>
      {isOpen && (
        <div className="absolute z-10 bottom-[105%] left-[510%] transform -translate-x-1/2 mt-2 w-[50vh] whitespace-normal">
          <div className="relative bg-white   text-gray-800 text-xs rounded py-3 px-3 shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-opacity duration-100">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
