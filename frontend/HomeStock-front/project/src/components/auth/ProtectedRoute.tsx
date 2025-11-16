import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-white" 
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
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              HomeStock
            </h2>
            
            <div className="flex items-center justify-center mb-4">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
            
            <p className="text-gray-600 text-sm">
              Verificando autenticación...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login guardando la ubicación actual
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Si está autenticado, renderizar el contenido protegido
  return <>{children}</>;
};

// Componente para rutas que requieren estar NO autenticado (login, register)
interface PublicOnlyRouteProps {
  children: ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-white" 
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
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              HomeStock
            </h2>
            
            <div className="flex items-center justify-center mb-4">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
            
            <p className="text-gray-600 text-sm">
              Cargando aplicación...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    // Obtener la ruta de destino del state (si viene de una redirección)
    const from = (location.state as any)?.from || '/';
    return <Navigate to={from} replace />;
  }

  // Si no está autenticado, mostrar la página pública (login/register)
  return <>{children}</>;
};