import React from 'react';
import { Client } from '../../types/client';
import { ClientCard } from './ClientCard';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClientListProps {
  clients: {
    deposit: Client[];
    building: Client[];
    built: Client[];
  };
  onContextMenu: (e: React.MouseEvent, client: Client) => void;
  loading: boolean;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  onContextMenu,
  loading
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const totalClients = clients.deposit.length + clients.building.length + clients.built.length;

  if (totalClients === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Нет клиентов</h3>
        <p className="text-gray-500">Добавьте первого клиента</p>
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent, client: Client) => {
    if (e.button === 0) { // Left click
      navigate(`/clients/${client.id}`);
    } else if (e.button === 2) { // Right click
      onContextMenu(e, client);
    }
  };

  const renderClientSection = (title: string, clientList: Client[], statusColor: string) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">{clientList.length} клиентов</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientList.map(client => (
          <div
            key={client.id}
            onMouseDown={(e) => handleClick(e, client)}
            onContextMenu={(e) => {
              e.preventDefault();
              onContextMenu(e, client);
            }}
          >
            <ClientCard
              client={client}
              onContextMenu={onContextMenu}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {clients.deposit.length > 0 && renderClientSection(
        'Задаток',
        clients.deposit,
        'border-amber-500'
      )}
      {clients.building.length > 0 && renderClientSection(
        'Строим',
        clients.building,
        'border-emerald-500'
      )}
      {clients.built.length > 0 && renderClientSection(
        'Построено',
        clients.built,
        'border-blue-500'
      )}
    </div>
  );
};