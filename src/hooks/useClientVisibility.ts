```typescript
import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client } from '../types/client';

export const useClientVisibility = (clientId: string) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'clients', clientId), (doc) => {
      if (doc.exists()) {
        setIsVisible(doc.data().isVisible ?? true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  const toggleVisibility = async () => {
    try {
      const clientRef = doc(db, 'clients', clientId);
      await updateDoc(clientRef, {
        isVisible: !isVisible
      });
    } catch (error) {
      console.error('Error toggling visibility:', error);
      throw error;
    }
  };

  return { isVisible, loading, toggleVisibility };
};
```