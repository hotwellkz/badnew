import { collection, addDoc, deleteDoc, doc, updateDoc, query, where, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { CategoryData } from '../../types';
import { toast } from 'react-hot-toast';
import { deleteClientContracts } from './contracts';

export const formatAmount = (amount: number): string => {
  return `${amount} ₸`;
};

export const parseAmount = (amountStr: string): number => {
  return parseFloat(amountStr.replace(/[^\d.-]/g, ''));
};

export const addCategory = async (categoryData: CategoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      amount: '0 ₸',
      isVisible: true,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId: string, data: any) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteClientWithHistory = async (clientId: string, clientName: string) => {
  try {
    const batch = writeBatch(db);

    // 1. Удаляем клиента
    batch.delete(doc(db, 'clients', clientId));

    // 2. Находим и удаляем все связанные категории
    const categoriesQuery = query(
      collection(db, 'categories'),
      where('title', '==', clientName)
    );
    const categoriesSnapshot = await getDocs(categoriesQuery);
    const categoryIds = categoriesSnapshot.docs.map(doc => doc.id);
    
    categoriesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // 3. Находим и удаляем все связанные транзакции
    if (categoryIds.length > 0) {
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('categoryId', 'in', categoryIds)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      transactionsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
    }

    // 4. Удаляем все договоры клиента
    await deleteClientContracts(clientId);

    // 5. Применяем все изменения
    await batch.commit();
    
    toast.success('Клиент и все связанные данные успешно удалены');
  } catch (error) {
    console.error('Error deleting client with history:', error);
    throw new Error('Не удалось удалить клиента и связанные данные');
  }
};

export const deleteClientIconsOnly = async (clientId: string, clientName: string) => {
  try {
    const batch = writeBatch(db);

    // 1. Удаляем клиента
    batch.delete(doc(db, 'clients', clientId));

    // 2. Находим и удаляем только категории
    const categoriesQuery = query(
      collection(db, 'categories'),
      where('title', '==', clientName)
    );
    const categoriesSnapshot = await getDocs(categoriesQuery);
    categoriesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // 3. Применяем изменения
    await batch.commit();
    
    toast.success('Клиент и связанные иконки успешно удалены');
  } catch (error) {
    console.error('Error deleting client icons:', error);
    throw new Error('Не удалось удалить клиента и иконки');
  }
};

export const toggleCategoryVisibility = async (categoryId: string, isVisible: boolean) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, { 
      isVisible: !isVisible,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling category visibility:', error);
    throw error;
  }
};