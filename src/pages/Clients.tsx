import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client } from '../types/client';
import { ClientSearch } from '../components/clients/ClientSearch';
import { ClientFilters } from '../components/clients/ClientFilters';
import { ClientList } from '../components/clients/ClientList';
import { ClientContextMenu } from '../components/clients/ClientContextMenu';
import { DeleteConfirmationModal } from '../components/clients/DeleteConfirmationModal';
import { ClientFiles } from '../components/clients/ClientFiles';
import { ExportButton } from '../components/clients/ExportButton';
import { useClientSearch } from '../hooks/useClientSearch';
import { useOverdueNotifications } from '../hooks/useOverdueNotifications';
import { NotificationCenter } from '../components/notifications/NotificationCenter';
import { deleteClientWithHistory, deleteClientIconsOnly } from '../lib/firebase/categories';
import { toast } from 'react-hot-toast';

export const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState<'all' | 'building' | 'deposit' | 'built'>('all');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);

  useOverdueNotifications();
  const filteredClients = useClientSearch(clients, searchQuery);

  useEffect(() => {
    let q = query(
      collection(db, 'clients'),
      where('year', '==', selectedYear)
    );

    if (status !== 'all') {
      q = query(
        collection(db, 'clients'),
        where('status', '==', status),
        where('year', '==', selectedYear),
        orderBy('createdAt', 'desc')
      );
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      
      setClients(clientsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [status, selectedYear]);

  const handleContextMenu = (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedClient(client);
    setShowContextMenu(true);
  };

  const handleDeleteWithHistory = async () => {
    if (!selectedClient) return;
    try {
      await deleteClientWithHistory(
        selectedClient.id,
        `${selectedClient.lastName} ${selectedClient.firstName}`
      );
      setShowDeleteModal(false);
      setSelectedClient(null);
      toast.success('Клиент и все связанные данные удалены');
    } catch (error) {
      console.error('Error deleting client with history:', error);
      toast.error('Ошибка при удалении клиента');
    }
  };

  const handleDeleteIconsOnly = async () => {
    if (!selectedClient) return;
    try {
      await deleteClientIconsOnly(
        selectedClient.id,
        `${selectedClient.lastName} ${selectedClient.firstName}`
      );
      setShowDeleteModal(false);
      setSelectedClient(null);
      toast.success('Клиент и связанные иконки удалены');
    } catch (error) {
      console.error('Error deleting client icons:', error);
      toast.error('Ошибка при удалении иконок');
    }
  };

  const handleViewFiles = () => {
    if (selectedClient) {
      setShowFilesModal(true);
      setShowContextMenu(false);
    }
  };

  // Группируем клиентов по статусу
  const groupedClients = {
    deposit: filteredClients.filter(c => c.status === 'deposit'),
    building: filteredClients.filter(c => c.status === 'building'),
    built: filteredClients.filter(c => c.status === 'built')
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button onClick={() => navigate('/')} className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Клиенты</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ExportButton clients={clients} />
              <button
                onClick={() => navigate('/clients/add')}
                className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-1" />
                Добавить клиента
              </button>
            </div>
          </div>

          <div className="py-4 flex flex-col sm:flex-row gap-4">
            <ClientSearch value={searchQuery} onChange={setSearchQuery} />
            <ClientFilters
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              status={status}
              setStatus={setStatus}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientList
          clients={groupedClients}
          onContextMenu={handleContextMenu}
          loading={loading}
        />
      </div>

      {showContextMenu && selectedClient && (
        <ClientContextMenu
          position={contextMenuPosition}
          onClose={() => setShowContextMenu(false)}
          onDelete={() => {
            setShowDeleteModal(true);
            setShowContextMenu(false);
          }}
          onViewFiles={handleViewFiles}
          clientName={`${selectedClient.lastName} ${selectedClient.firstName}`}
          clientId={selectedClient.id}
          isVisible={selectedClient.isVisible}
          currentStatus={selectedClient.status}
        />
      )}

      {showDeleteModal && selectedClient && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDeleteWithHistory={handleDeleteWithHistory}
          onDeleteIconsOnly={handleDeleteIconsOnly}
          clientName={`${selectedClient.lastName} ${selectedClient.firstName}`}
        />
      )}

      {showFilesModal && selectedClient && (
        <ClientFiles
          client={selectedClient}
          isOpen={showFilesModal}
          onClose={() => setShowFilesModal(false)}
        />
      )}

      <NotificationCenter />
    </div>
  );
};