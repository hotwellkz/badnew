import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './config';

const storage = getStorage(app);
const CACHE_PREFIX = 'hotwell_file_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 дней

// Функция для кэширования файла
const cacheFile = async (path: string, url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const cache = await caches.open('hotwell-files');
    await cache.put(path, new Response(blob));
    
    localStorage.setItem(CACHE_PREFIX + path, JSON.stringify({
      url,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Ошибка при кэшировании файла:', error);
  }
};

// Функция для получения файла из кэша
const getFromCache = async (path: string): Promise<string | null> => {
  try {
    const metadata = localStorage.getItem(CACHE_PREFIX + path);
    if (!metadata) return null;

    const { timestamp, url } = JSON.parse(metadata);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_PREFIX + path);
      const cache = await caches.open('hotwell-files');
      await cache.delete(path);
      return null;
    }

    const cache = await caches.open('hotwell-files');
    const response = await cache.match(path);
    if (!response) return null;

    return url;
  } catch (error) {
    console.error('Ошибка при получении файла из кэша:', error);
    return null;
  }
};

export const uploadFile = async (file: File, clientId: string): Promise<string> => {
  try {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const path = `clients/${clientId}/${timestamp}.${extension}`;
    const storageRef = ref(storage, path);
    
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    await cacheFile(path, url);
    
    return url;
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    throw new Error('Не удалось загрузить файл');
  }
};

export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const cachedUrl = await getFromCache(path);
    if (cachedUrl) return cachedUrl;

    const url = await getDownloadURL(ref(storage, path));
    await cacheFile(path, url);
    return url;
  } catch (error) {
    console.error('Ошибка при получении URL файла:', error);
    throw new Error('Не удалось получить файл');
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    await deleteObject(ref(storage, path));
    
    localStorage.removeItem(CACHE_PREFIX + path);
    const cache = await caches.open('hotwell-files');
    await cache.delete(path);
  } catch (error) {
    console.error('Ошибка при удалении файла:', error);
    throw new Error('Не удалось удалить файл');
  }
};