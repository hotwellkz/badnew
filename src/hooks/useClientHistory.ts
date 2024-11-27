```typescript
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface HistoryEntry {
  id: string;
  clientId: string;
  action: string;
  changes: Record<string, any>;
  timestamp: any;
  userId: string;
}

export const useClientHistory = (clientId: string) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'clientHistory'),
      where('clientId', '==', clientId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HistoryEntry[];

      setHistory(historyData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  return { history, loading };
};
```