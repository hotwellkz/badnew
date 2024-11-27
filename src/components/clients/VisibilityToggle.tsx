```typescript
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Client } from '../../types/client';

interface VisibilityToggleProps {
  client: Client;
  onToggle?: () => void;
}

export const VisibilityToggle: React.FC<VisibilityToggleProps> = ({ client, onToggle }) => {
  const handleToggle = async () => {
    try {
      const clientRef = doc(db, 'clients', client.id);
      await updateDoc(clientRef, {
        isVisible: !client.isVisible
      });
      onToggle?.();
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('Ошибка при изменении видимости');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
      title={client.isVisible ? 'Скрыть иконки' : 'Показать иконки'}
    >
      {client.isVisible ? (
        <EyeOff className="w-5 h-5" />
      ) : (
        <Eye className="w-5 h-5" />
      )}
    </button>
  );
};
```