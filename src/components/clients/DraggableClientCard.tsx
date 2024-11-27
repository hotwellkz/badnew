import React from 'react';
import { motion } from 'framer-motion';
import { Client } from '../../types/client';
import { useProgress } from '../../hooks/useProgress';
import { PaymentProgress } from './PaymentProgress';

interface ClientCardProps {
  client: Client;
  onContextMenu: (e: React.MouseEvent, client: Client) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onContextMenu
}) => {
  const { progress, isOverdue } = useProgress(client);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 border-l-4 ${
        isOverdue ? 'border-red-500' : 
        client.status === 'building' ? 'border-emerald-500' :
        client.status === 'deposit' ? 'border-amber-500' :
        'border-blue-500'
      }`}
      onClick={(e) => onContextMenu(e, client)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {client.lastName} {client.firstName}
            </h3>
            <p className="text-sm text-gray-500">{client.clientNumber}</p>
          </div>
          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
            client.status === 'building' ? 'bg-emerald-100 text-emerald-800' :
            client.status === 'deposit' ? 'bg-amber-100 text-amber-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {client.status === 'building' ? 'Строим' :
             client.status === 'deposit' ? 'Задаток' :
             'Построено'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            {client.constructionAddress}
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Сумма:</span>
            <span className="font-medium">{client.totalAmount.toLocaleString()} ₸</span>
          </div>

          <PaymentProgress client={client} />
        </div>
      </div>
    </motion.div>
  );
};