import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Client } from '../../types/client';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { toast } from 'react-hot-toast';

interface ExportButtonProps {
  clients: Client[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ clients }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      if (format === 'excel') {
        await exportToExcel(clients);
      } else {
        await exportToPDF(clients);
      }
      toast.success(`Экспорт в формат ${format.toUpperCase()} выполнен успешно`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Ошибка при экспорте данных');
    }
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        <Download className="w-5 h-5 mr-2" />
        Экспорт
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => handleExport('excel')}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              Экспорт в Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              Экспорт в PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};