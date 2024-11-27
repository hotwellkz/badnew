import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ScrollText, 
  Receipt, 
  History, 
  Star, 
  Share2, 
  Settings, 
  HelpCircle,
  RefreshCw,
  FileText,
  Users,
  Menu,
  X,
  Package,
  ArrowLeftRight,
  Building2,
  Calculator
} from 'lucide-react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { 
      icon: <ArrowLeftRight className="w-5 h-5" />, 
      label: 'Транзакции', 
      path: '/'
    },
    { 
      icon: <ScrollText className="w-5 h-5" />, 
      label: 'Лента', 
      path: '/feed'
    },
    { 
      icon: <Receipt className="w-5 h-5" />, 
      label: 'Отчет по дням', 
      path: '/daily-report'
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: 'Клиенты', 
      path: '/clients'
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: 'Сотрудники', 
      path: '/employees'
    },
    { 
      icon: <Building2 className="w-5 h-5" />, 
      label: 'Проекты', 
      path: '/projects'
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: 'Шаблоны договоров', 
      path: '/templates'
    },
    { 
      icon: <Package className="w-5 h-5" />, 
      label: 'Товары и цены', 
      path: '/products'
    },
    { 
      icon: <Calculator className="w-5 h-5" />, 
      label: 'Калькулятор', 
      path: '/calculator'
    }
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:w-64
      `}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4 mt-16 lg:mt-0">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleMenuItemClick(item.path)}
                className={`w-full flex items-center px-6 py-3 text-gray-700 transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className={location.pathname === item.path ? 'text-emerald-600' : 'text-emerald-500'}>
                  {item.icon}
                </span>
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center text-sm text-gray-500">
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>Сегодня, {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};