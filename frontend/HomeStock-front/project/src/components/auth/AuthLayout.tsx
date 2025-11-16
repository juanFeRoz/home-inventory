import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50 to-green-50 rounded-full opacity-30"></div>
      </div>

      {/* Container principal */}
      <div className="relative w-full max-w-md">
        {/* Logo y branding */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HomeStock
          </h1>
          <p className="text-gray-600 text-sm">
            Gestiona tu inventario familiar con facilidad
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header del formulario */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              {title}
            </h2>
            <p className="text-gray-600 text-center text-sm">
              {subtitle}
            </p>
          </div>

          {/* Contenido del formulario */}
          <div className="px-8 py-6">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2025 HomeStock. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Elementos decorativos adicionales */}
      <div className="fixed top-4 left-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
      <div className="fixed top-8 right-8 w-1 h-1 bg-green-400 rounded-full opacity-60 animate-ping delay-1000"></div>
      <div className="fixed bottom-4 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60 animate-ping delay-2000"></div>
      <div className="fixed bottom-8 right-4 w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-ping delay-3000"></div>
    </div>
  );
};