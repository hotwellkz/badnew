import React from 'react';
import { CategoryCardType } from '../../types';
import { Building2, User, CheckCircle } from 'lucide-react';

interface CategoryCardProps {
  category: CategoryCardType;
  onHistoryClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category,
  onHistoryClick 
}) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onHistoryClick();
  };

  const getIcon = () => {
    switch (category.status) {
      case 'building':
        return <Building2 className="w-6 h-6 text-white" />;
      case 'built':
        return <CheckCircle className="w-6 h-6 text-white" />;
      default:
        return <User className="w-6 h-6 text-white" />;
    }
  };

  const getStatusColor = () => {
    switch (category.status) {
      case 'building':
        return 'bg-emerald-500';
      case 'deposit':
        return 'bg-amber-500';
      case 'built':
        return 'bg-blue-500';
      default:
        return category.color || 'bg-gray-500';
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className="flex flex-col items-center space-y-3 py-2"
    >
      <div className={`w-12 h-12 sm:w-14 sm:h-14 ${getStatusColor()} rounded-full flex items-center justify-center shadow-lg`}>
        {getIcon()}
      </div>
      <div className="text-center">
        <div className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[70px] sm:max-w-[80px]">
          {category.title}
        </div>
        <div className={`text-xs sm:text-sm font-medium ${
          category.amount.includes('-') ? 'text-red-500' : 'text-emerald-500'
        }`}>
          {category.amount}
        </div>
      </div>
    </div>
  );
};