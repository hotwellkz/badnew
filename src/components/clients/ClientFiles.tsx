import React, { useState, useCallback } from 'react';
import { X, Upload, Download, Share2, Trash2, FileText } from 'lucide-react';
import { Client } from '../../types/client';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadFile, deleteFile, getFileUrl } from '../../lib/firebase/storage';
import { shareContent } from '../../utils/shareUtils';
import { toast } from 'react-hot-toast';

interface ClientFilesProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientFiles: React.FC<ClientFilesProps> = ({
  client,
  isOpen,
  onClose
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const url = await uploadFile(selectedFile, client.id);
      
      const clientRef = doc(db, 'clients', client.id);
      await updateDoc(clientRef, {
        files: [...(client.files || []), {
          name: selectedFile.name,
          path: url,
          uploadedAt: new Date()
        }]
      });

      toast.success('Файл успешно загружен');
      setSelectedFile(null);
    } catch (error) {
      toast.error('Ошибка при загрузке файла');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (path: string, fileName: string) => {
    try {
      const url = await getFileUrl(path);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Ошибка при скачивании файла');
      console.error('Error downloading file:', error);
    }
  };

  const handleShare = async (fileName: string, path: string) => {
    try {
      const url = await getFileUrl(path);
      const shareText = [
        `Файл: ${fileName}`,
        `Клиент: ${client.lastName} ${client.firstName}`,
        `Ссылка: ${url}`
      ].join('\n');

      await shareContent('Поделиться файлом', shareText);
      toast.success('Ссылка скопирована');
    } catch (error) {
      toast.error('Ошибка при создании ссылки');
      console.error('Error sharing file:', error);
    }
  };

  const handleDelete = async (path: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот файл?')) return;

    try {
      await deleteFile(path);
      
      const clientRef = doc(db, 'clients', client.id);
      await updateDoc(clientRef, {
        files: (client.files || []).filter(f => f.path !== path)
      });

      toast.success('Файл удален');
    } catch (error) {
      toast.error('Ошибка при удалении файла');
      console.error('Error deleting file:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Файлы клиента</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {!client.files?.length ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Нет загруженных файлов</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {client.files.map((file, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium truncate">{file.name}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(file.path, file.name)}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Скачать"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare(file.name, file.path)}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Поделиться"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.path)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Загружен: {new Date(file.uploadedAt).toLocaleString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {selectedFile ? selectedFile.name : 'Выберите файл'}
            </label>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors disabled:bg-gray-300"
            >
              {uploading ? 'Загрузка...' : 'Загрузить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};