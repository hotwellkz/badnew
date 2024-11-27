import React from 'react';
import { Search } from 'lucide-react';

interface ClientSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ClientSearch: React.FC<ClientSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по имени, номеру или адресу..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
};