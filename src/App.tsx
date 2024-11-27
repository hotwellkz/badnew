import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Feed } from './pages/Feed';
import { DailyReport } from './pages/DailyReport';
import { Clients } from './pages/Clients';
import { AddClientPage } from './pages/AddClientPage';
import { ClientDetailsPage } from './pages/ClientDetailsPage';
import { ContractTemplates } from './pages/ContractTemplates';
import { Products } from './pages/Products';
import { Transactions } from './pages/Transactions';
import { Employees } from './pages/Employees';
import { Projects } from './pages/Projects';
import { Calculator } from './pages/Calculator';
import { useStats } from './hooks/useStats';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const { stats, loading, error } = useStats();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-xl text-red-500 p-4 bg-white rounded-lg shadow">
          {error}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header stats={stats} />
        <div className="lg:pl-64">
          <Routes>
            <Route path="/" element={<Transactions />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/daily-report" element={<DailyReport />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/add" element={<AddClientPage />} />
            <Route path="/clients/:id" element={<ClientDetailsPage />} />
            <Route path="/templates" element={<ContractTemplates />} />
            <Route path="/products" element={<Products />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </div>
        <Sidebar />
      </div>
    </Router>
  );
};

export default App;