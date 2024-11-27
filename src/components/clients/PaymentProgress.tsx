import React from 'react';
import { Client } from '../../types/client';

interface PaymentProgressProps {
  client: Client;
}

export const PaymentProgress: React.FC<PaymentProgressProps> = ({ client }) => {
  const totalPaid = client.deposit + client.firstPayment + 
                   client.secondPayment + client.thirdPayment + 
                   client.fourthPayment;
  
  const paymentProgress = (totalPaid / client.totalAmount) * 100;
  const isFullyPaid = totalPaid >= client.totalAmount;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Оплачено: {totalPaid.toLocaleString()} ₸ из {client.totalAmount.toLocaleString()} ₸
        </div>
        <div className="text-sm font-medium">
          {Math.round(paymentProgress)}%
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isFullyPaid ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
          style={{ width: `${paymentProgress}%` }}
        />
      </div>
    </div>
  );
};