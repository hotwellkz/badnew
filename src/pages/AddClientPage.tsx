import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { addCategory } from '../lib/firebase/categories';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const AddClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    status: 'deposit' as 'building' | 'deposit' | 'built',
    year: new Date().getFullYear()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Генерируем номер клиента
      const clientsRef = collection(db, 'clients');
      const clientNumber = `${formData.year}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;

      // Создаем клиента
      const clientRef = await addDoc(clientsRef, {
        ...formData,
        clientNumber,
        createdAt: serverTimestamp(),
        isVisible: true,
        files: []
      });

      // Создаем категории для клиента
      await Promise.all([
        // Категория клиента
        addCategory({
          title: `${formData.lastName} ${formData.firstName}`,
          icon: 'User',
          color: 'bg-amber-400',
          row: 1,
          status: 'deposit',
          isVisible: true
        }),
        // Категория проекта
        addCategory({
          title: `${formData.lastName} ${formData.firstName}`,
          icon: 'Building2',
          color: 'bg-blue-500',
          row: 3,
          status: 'deposit',
          isVisible: true
        })
      ]);

      toast.success('Клиент успешно добавлен');
      navigate('/clients');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Ошибка при добавлении клиента');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Payment') || name === 'totalAmount' ? Number(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button onClick={() => navigate('/clients')} className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              Добавить клиента
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  Задаток
                </label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Первый транш
                </label>
                <input
                  type="number"
                  name="firstPayment"
                  value={formData.firstPayment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Второй транш
                </label>
                <input
                  type="number"
                  name="secondPayment"
                  value={formData.secondPayment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Третий транш
                </label>
                <input
                  type="number"
                  name="thirdPayment"
                  value={formData.thirdPayment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Четвертый транш
                </label>
                <input
                  type="number"
                  name="fourthPayment"
                  value={formData.fourthPayment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  min={0}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => navigate('/clients')}
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
    </div>
  );
};