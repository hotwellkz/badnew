```typescript
import React from 'react';
import { X, History } from 'lucide-react';
import { useClientHistory } from '../../hooks/useClientHistory';
import { formatDate } from '../../utils/dateUtils';

interface ClientHistoryProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientHistory: React.FC<ClientHistoryProps> = ({
  clientId,
  isOpen,
  onClose
}) => {
  const { history, loading } = useClientHistory(clientId);

  if (!isOpen) return null;

  const formatChange = (change: any) => {
    const changes = [];
    for (const [key, value] of Object.entries(change)) {
      switch (key) {
        case 'status':
          changes.push(`Статус изменен на "${value}"`);
          break;
        case 'totalAmount':
          changes.push(`Общая сумма изменена на ${value.toLocaleString()} ₸`);
          break;
        case 'constructionDays':
          changes.push(`Срок строительства изменен на ${value} дней`);
          break;
        default:
          changes.push(`${key} изменено на ${value}`);
      }
    }
    return changes.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold">История изменений</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              История изменений пуста
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{entry.action}</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatChange(entry.changes)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```