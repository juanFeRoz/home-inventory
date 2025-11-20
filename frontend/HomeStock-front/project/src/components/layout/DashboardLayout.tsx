import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HomePage } from '../dashboard/HomePage';
import ListaCompraManager from '../listasCompra/ListaCompraManager.tsx';
import { FamilyGroupPage } from '../familyGroup';
import { LugarPage } from '../lugares/LugarPage';
import { Button } from '../ui/button';
import { LogOut, Home, Users, ShoppingCart, User, MapPin, Clock } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 w-8 h-8 rounded-lg mr-3 flex items-center justify-center">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4" 
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">HomeStock</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors"
              >
                <Home size={18} />
                Inicio
              </button>
              <button
                onClick={() => navigate('/grupos-familiares')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors"
              >
                <Users size={18} />
                Grupos Familiares
              </button>
              <button
                onClick={() => navigate('/lugares')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors"
              >
                <MapPin size={18} />
                Lugares
              </button>
              <button
                onClick={() => navigate('/listas-compra')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors"
              >
                <ShoppingCart size={18} />
                Listas de Compra
              </button>
            </nav>

            {/* User menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-base text-gray-600">
                <User size={18} />
                <span>Hola, {user?.username}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="default"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={18} />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grupos-familiares" element={<FamilyGroupPage />} />
          <Route path="/lugares" element={<LugarPage />} />
          <Route path="/listas-compra" element={<ListaCompraManager />} />
          <Route path="/reportes" element={<ComingSoonPage title="Reportes" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Componente temporal para páginas que aún no están implementadas
const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="text-center py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">
          Esta funcionalidad estará disponible próximamente.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            🚧 En desarrollo - Pronto tendrás acceso a todas las características de {title.toLowerCase()}.
          </p>
        </div>
      </div>
    </div>
  );
};