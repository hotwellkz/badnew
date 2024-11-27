import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, FileText, Eye, EyeOff, Building2, Wallet, CheckCircle2 } from 'lucide-react';
import { doc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

interface ClientContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onDelete: () => void;
  onViewFiles: () => void;
  clientName: string;
  clientId: string;
  isVisible?: boolean;
  currentStatus: 'building' | 'deposit' | 'built';
}

export const ClientContextMenu: React.FC<ClientContextMenuProps> = ({
  position,
  onClose,
  onDelete,
  onViewFiles,
  clientName,
  clientId,
  isVisible = true,
  currentStatus
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleStatusChange = async (newStatus: 'building' | 'deposit' | 'built') => {
    try {
      const batch = writeBatch(db);

      // Обновляем статус клиента
      const clientRef = doc(db, 'clients', clientId);
      batch.update(clientRef, { status: newStatus });

      // Обновляем статус в связанных категориях
      const categoriesQuery = query(
        collection(db, 'categories'),
        where('title', '==', clientName)
      );
      const categoriesSnapshot = await getDocs(categoriesQuery);
      
      categoriesSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { status: newStatus });
      });
      
      await batch.commit();
      toast.success('Статус клиента обновлен');
      onClose();
    } catch (error) {
      console.error('Error updating client status:', error);
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const handleVisibilityToggle = async () => {
    try {
      const batch = writeBatch(db);

      // Обновляем видимость клиента
      const clientRef = doc(db, 'clients', clientId);
      batch.update(clientRef, { isVisible: !isVisible });

      // Обновляем видимость в связанных категориях
      const categoriesQuery = query(
        collection(db, 'categories'),
        where('title', '==', clientName)
      );
      const categoriesSnapshot = await getDocs(categoriesQuery);
      
      categoriesSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { isVisible: !isVisible });
      });
      
      await batch.commit();
      toast.success(isVisible ? 'Иконки скрыты' : 'Иконки показаны');
      onClose();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Ошибка при изменении видимости');
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-lg py-1 z-50 min-w-[200px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <button
        onClick={onViewFiles}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        Файлы
      </button>

      <button
        onClick={handleVisibilityToggle}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        {isVisible ? (
          <>
            <EyeOff className="w-4 h-4" />
            Скрыть иконки
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            Показать иконки
          </>
        )}
      </button>

      {currentStatus !== 'building' && (
        <button
          onClick={() => handleStatusChange('building')}
          className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          Перевести в "Строим"
        </button>
      )}

      {currentStatus !== 'deposit' && (
        <button
          onClick={() => handleStatusChange('deposit')}
          className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          Перевести в "Задаток"
        </button>
      )}

      {currentStatus !== 'built' && (
        <button
          onClick={() => handleStatusChange('built')}
          className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Перевести в "Построено"
        </button>
      )}

      <button
        onClick={onDelete}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Удалить
      </button>
    </div>
  );
};