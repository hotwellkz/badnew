import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleCategoryProps {
  title: string;
  count: number;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CollapsibleCategory: React.FC<CollapsibleCategoryProps> = ({
  title,
  count,
  isCollapsed,
  onToggle,
  children
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center">
          <motion.div
            initial={false}
            animate={{ rotate: isCollapsed ? 0 : 90 }}
            transition={{ duration: 0.2 }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </motion.div>
          <span className="ml-2 font-medium">{title}</span>
          <span className="ml-2 text-sm text-gray-500">({count})</span>
        </div>
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};