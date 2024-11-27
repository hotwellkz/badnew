import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: { y: -10, x: '-50%' },
    bottom: { y: 10, x: '-50%' },
    left: { x: -10, y: '-50%' },
    right: { x: 10, y: '-50%' }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, ...positions[position] }}
            animate={{ opacity: 1, y: position === 'top' ? -5 : position === 'bottom' ? 5 : 0 }}
            exit={{ opacity: 0 }}
            className={`
              absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded
              whitespace-nowrap pointer-events-none
              ${position === 'top' ? 'bottom-full left-1/2 mb-1' :
                position === 'bottom' ? 'top-full left-1/2 mt-1' :
                position === 'left' ? 'right-full top-1/2 mr-1' :
                'left-full top-1/2 ml-1'}
            `}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};