import React from 'react';

interface ClientFiltersProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  status: 'building' | 'deposit' | 'built' | 'all';
  setStatus: (status: 'building' | 'deposit' | 'built' | 'all') => void;
}

export const ClientFilters: React.FC<ClientFiltersProps> = ({
  selectedYear,
  setSelectedYear,
  status,
  setStatus
}) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
    <div className="flex space-x-4 py-4">
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
      >
        {yearOptions.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as 'building' | 'deposit' | 'built' | 'all')}
        className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
      >
        <option value="all">Все клиенты</option>
        <option value="deposit">Задаток</option>
        <option value="building">Строим</option>
        <option value="built">Построено</option>
      </select>
    </div>
  );
};