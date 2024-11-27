import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import { jsPDF } from 'jspdf';
import { Client } from '../types/client';

export const exportToExcel = async (clients: Client[]) => {
  try {
    // Подготавливаем данные для экспорта
    const data = clients.map(client => ({
      'Номер клиента': client.clientNumber,
      'Фамилия': client.lastName,
      'Имя': client.firstName,
      'Отчество': client.middleName || '',
      'Телефон': client.phone,
      'Email': client.email,
      'ИИН': client.iin,
      'Адрес строительства': client.constructionAddress,
      'Адрес прописки': client.livingAddress,
      'Объект': client.objectName,
      'Дней строительства': client.constructionDays,
      'Общая сумма': client.totalAmount.toLocaleString('ru-RU'),
      'Задаток': client.deposit.toLocaleString('ru-RU'),
      'Первый транш': client.firstPayment.toLocaleString('ru-RU'),
      'Второй транш': client.secondPayment.toLocaleString('ru-RU'),
      'Третий транш': client.thirdPayment.toLocaleString('ru-RU'),
      'Четвертый транш': client.fourthPayment.toLocaleString('ru-RU'),
      'Статус': client.status === 'building' ? 'Строим' : 
                client.status === 'deposit' ? 'Задаток' : 'Построено'
    }));

    // Создаем рабочую книгу и лист
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(data, { 
      header: Object.keys(data[0]),
      skipHeader: false
    });

    // Устанавливаем ширину столбцов
    const colWidths = Object.keys(data[0]).map(key => ({
      wch: Math.max(key.length, 20)
    }));
    ws['!cols'] = colWidths;

    // Добавляем лист в книгу
    utils.book_append_sheet(wb, ws, 'Клиенты');

    // Генерируем файл
    const excelBuffer = write(wb, { 
      bookType: 'xlsx', 
      type: 'array',
      bookSST: false,
      compression: true
    });

    // Создаем blob и сохраняем файл
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, `Клиенты_${new Date().toLocaleDateString('ru-RU')}.xlsx`);
  } catch (error) {
    console.error('Ошибка при экспорте в Excel:', error);
    throw error;
  }
};

export const exportToPDF = async (clients: Client[]) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });

    // Устанавливаем шрифт для поддержки кириллицы
    doc.setFont('helvetica');
    
    // Заголовок
    doc.setFontSize(16);
    doc.text('Список клиентов', 20, 20);
    
    // Данные клиентов
    doc.setFontSize(10);
    let y = 40;
    
    clients.forEach((client, index) => {
      // Добавляем новую страницу, если не хватает места
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      const status = client.status === 'building' ? 'Строим' : 
                     client.status === 'deposit' ? 'Задаток' : 'Построено';
      
      // Основная информация
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${client.lastName} ${client.firstName} ${client.middleName || ''}`, 20, y);
      doc.setFont('helvetica', 'normal');
      
      // Детали клиента
      y += 7;
      doc.text(`Номер: ${client.clientNumber}`, 25, y);
      y += 5;
      doc.text(`Телефон: ${client.phone}`, 25, y);
      y += 5;
      doc.text(`Email: ${client.email}`, 25, y);
      y += 5;
      doc.text(`Статус: ${status}`, 25, y);
      y += 5;
      doc.text(`Адрес: ${client.constructionAddress}`, 25, y);
      y += 5;
      doc.text(`Сумма: ${client.totalAmount.toLocaleString('ru-RU')} ₸`, 25, y);
      
      y += 10; // Отступ между клиентами
    });
    
    // Сохраняем файл
    doc.save(`Клиенты_${new Date().toLocaleDateString('ru-RU')}.pdf`);
  } catch (error) {
    console.error('Ошибка при экспорте в PDF:', error);
    throw error;
  }
};