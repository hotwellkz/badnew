import { useMemo } from 'react';
import { Client } from '../types/client';

export const usePaymentProgress = (client: Client) => {
  return useMemo(() => {
    const totalPaid = client.deposit + client.firstPayment + 
                     client.secondPayment + client.thirdPayment + 
                     client.fourthPayment;
    
    const paymentProgress = (totalPaid / client.totalAmount) * 100;
    
    const stages = [
      { name: 'Задаток', amount: client.deposit, paid: totalPaid >= client.deposit },
      { name: 'Первый транш', amount: client.firstPayment, paid: totalPaid >= (client.deposit + client.firstPayment) },
      { name: 'Второй транш', amount: client.secondPayment, paid: totalPaid >= (client.deposit + client.firstPayment + client.secondPayment) },
      { name: 'Третий транш', amount: client.thirdPayment, paid: totalPaid >= (client.deposit + client.firstPayment + client.secondPayment + client.thirdPayment) },
      { name: 'Четвертый транш', amount: client.fourthPayment, paid: totalPaid >= client.totalAmount }
    ];

    return {
      totalPaid,
      paymentProgress,
      stages,
      isFullyPaid: totalPaid >= client.totalAmount
    };
  }, [client]);
};