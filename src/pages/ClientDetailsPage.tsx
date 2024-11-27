import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client } from '../types/client';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ClientDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({});

  useEffect(() => {
    const loadClient = async () => {
      if (!id) return;
      try {
        const clientDoc = await getDoc(doc(db, 'clients', id));
        if (clientDoc.exists()) {
          const data = { id: clientDoc.id, ...clientDoc.data() } as Client;
          setClient(data);
          setFormData(data);
        } else {
          toast.error('Клиент не найден');
          navigate('/clients');
        }
      } catch (error) {
        console.error('Error loading client:', error);
        toast.error('Ошибка при загрузке данных клиента');
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Payment') || name === 'totalAmount' || name === 'constructionDays' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      const clientRef = doc(db, 'clients', id);
      await updateDoc(clientRef, {
        ...formData,
        updatedAt: serverTimestamp()
      });
      toast.success('Данные клиента обновлены');
      navigate('/clients');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Ошибка при сохранении данных');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!client) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button onClick={() => navigate('/clients')} className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                {client.lastName} {client.firstName}
              </h1>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors disabled:bg-gray-400"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
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
                  value={formData.lastName || ''}
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
                  value={formData.firstName || ''}
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
                  value={formData.middleName || ''}
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
                  value={formData.iin || ''}
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
                  value={formData.phone || ''}
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
                  value={formData.email || ''}
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
                  value={formData.constructionAddress || ''}
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
                  value={formData.livingAddress || ''}
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
                  value={formData.objectName || ''}
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
                  value={formData.constructionDays || 0}
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
                  value={formData.totalAmount || 0}
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
                  value={formData.deposit || 0}
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
                  value={formData.firstPayment || 0}
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
                  value={formData.secondPayment || 0}
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
                  value={formData.thirdPayment || 0}
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
                  value={formData.fourthPayment || 0}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  min={0}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};