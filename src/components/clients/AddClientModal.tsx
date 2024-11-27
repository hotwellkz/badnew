import React, { useState } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Client } from '../../types/client';
import { addCategory } from '../../lib/firebase';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
}

const initialState = {
  lastName: '',
  firstName: '',
  middleName: '',
  phone: '',
  email: '',
  iin: '',
  constructionAddress: '',
  livingAddress: '',
  objectName: '',
  constructionDays: 45,
  totalAmount: 0,
  deposit: 75000,
  firstPayment: 0,
  secondPayment: 0,
  thirdPayment: 0,
  fourthPayment: 0,
  status: 'deposit' as const,
  files: []
};

export const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  year
}) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const generateClientNumber = async (status: 'building' | 'deposit' | 'built') => {
    try {
      const q = query(
        collection(db, 'clients'),
        where('status', '==', status),
        where('year', '==', year)
      );
      
      const snapshot = await getDocs(q);
      let maxNumber = 0;

      snapshot.forEach(doc => {
        const clientData = doc.data();
        const currentNumber = parseInt(clientData.clientNumber.split('-')[1]);
        if (currentNumber > maxNumber) {
          maxNumber = currentNumber;
        }
      });

      const nextNumber = maxNumber + 1;
      return `${year}-${String(nextNumber).padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating client number:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Генерируем номер клиента
      const clientNumber = await generateClientNumber(formData.status);
      
      // Создаем клиента
      const clientRef = await addDoc(collection(db, 'clients'), {
        ...formData,
        clientNumber,
        year,
        createdAt: serverTimestamp(),
        progress: 0
      });

      // Создаем категории для клиента
      await Promise.all([
        // Категория клиента
        addCategory({
          title: `${formData.lastName} ${formData.firstName}`,
          icon: 'User',
          color: 'bg-amber-400',
          row: 1
        }),
        // Категория проекта
        addCategory({
          title: `${formData.lastName} ${formData.firstName}`,
          icon: 'Building2',
          color: 'bg-blue-500',
          row: 3
        })
      ]);

      onClose();
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Ошибка при добавлении клиента');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' || name === 'constructionDays' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Добавить клиента</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Отчество
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ИИН
              </label>
              <input
                type="text"
                name="iin"
                value={formData.iin}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
                maxLength={12}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес строительства
              </label>
              <input
                type="text"
                name="constructionAddress"
                value={formData.constructionAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес прописки
              </label>
              <input
                type="text"
                name="livingAddress"
                value={formData.livingAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название объекта
              </label>
              <input
                type="text"
                name="objectName"
                value={formData.objectName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дней строительства
              </label>
              <input
                type="number"
                name="constructionDays"
                value={formData.constructionDays}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
                min={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Общая сумма
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                required
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="deposit">Задаток</option>
                <option value="building">Строим</option>
                <option value="built">Построено</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              {loading ? 'Добавление...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};