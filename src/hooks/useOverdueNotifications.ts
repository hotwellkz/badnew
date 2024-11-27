import { useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Client } from '../types/client';

export const useOverdueNotifications = () => {
  useEffect(() => {
    // Получаем только активные проекты
    const q = query(
      collection(db, 'clients'),
      where('status', '==', 'building')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach(doc => {
        const client = doc.data() as Client;
        const startDate = client.createdAt?.toDate();
        
        if (startDate) {
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + client.constructionDays);
          
          const now = new Date();
          if (now > endDate) {
            toast.error(
              `Срок строительства истек: ${client.lastName} ${client.firstName}`,
              {
                duration: 5000,
                id: `overdue-${client.id}`, // Предотвращаем дубликаты
                icon: '⚠️'
              }
            );
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);
};