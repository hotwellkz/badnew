import { useMemo } from 'react';
import { Client } from '../types/client';

export const useClientSearch = (clients: Client[], searchQuery: string) => {
  return useMemo(() => {
    if (!searchQuery.trim()) return clients;

    const query = searchQuery.toLowerCase().trim();
    const terms = query.split(/\s+/);

    return clients.filter(client => {
      const searchableText = [
        client.lastName,
        client.firstName,
        client.middleName,
        client.clientNumber,
        client.constructionAddress,
        client.phone,
        client.email,
        client.objectName
      ].map(text => text?.toLowerCase() || '').join(' ');

      return terms.every(term => searchableText.includes(term));
    });
  }, [clients, searchQuery]);
};