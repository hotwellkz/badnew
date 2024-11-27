import { toast } from 'react-hot-toast';

interface ErrorMessages {
  [key: string]: string;
}

const ERROR_MESSAGES: ErrorMessages = {
  'permission-denied': 'У вас нет прав для выполнения этого действия',
  'not-found': 'Запрашиваемый ресурс не найден',
  'already-exists': 'Такая запись уже существует',
  'invalid-argument': 'Неверные параметры запроса',
  'failed-precondition': 'Не выполнены необходимые условия',
  'unauthenticated': 'Требуется авторизация',
  'resource-exhausted': 'Превышен лимит запросов',
  'cancelled': 'Операция отменена',
  'data-loss': 'Произошла потеря данных',
  'unknown': 'Произошла неизвестная ошибка',
  'internal': 'Внутренняя ошибка сервера',
  'unavailable': 'Сервис временно недоступен',
  'deadline-exceeded': 'Превышено время ожидания'
};

export const handleError = (error: any) => {
  console.error('Error:', error);

  const code = error.code || 'unknown';
  const message = ERROR_MESSAGES[code] || error.message || ERROR_MESSAGES.unknown;

  toast.error(message, {
    duration: 5000,
    position: 'top-right'
  });

  return message;
};