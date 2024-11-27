```typescript
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client } from '../types/client';

export const useVisibleClients = () => {
  const [visibleClients, setVisibleClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'clients'),
      where('isVisible', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];

      setVisibleClients(clients);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { visibleClients, loading };
};
```