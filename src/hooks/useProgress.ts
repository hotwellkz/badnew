import { useState, useEffect } from 'react';
import { Client } from '../types/client';

export const useProgress = (client: Client) => {
  const [progress, setProgress] = useState(0);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (client.status !== 'building') {
      setProgress(client.status === 'built' ? 100 : 0);
      return;
    }

    const startDate = client.createdAt?.toDate() || new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + client.constructionDays);

    const now = new Date();
    const totalDays = client.constructionDays;
    const elapsedDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const calculatedProgress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
    setProgress(calculatedProgress);
    
    setIsOverdue(now > endDate && calculatedProgress < 100);
  }, [client]);

  return { progress, isOverdue };
};