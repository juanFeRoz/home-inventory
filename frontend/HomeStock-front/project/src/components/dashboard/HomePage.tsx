import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Users, Package, ShoppingCart, Plus, BarChart3, Settings } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Grupos Familiares',
      description: 'Crea y gestiona grupos familiares para compartir inventarios',
      action: () => navigate('/grupos-familiares'),
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      icon: Package,
      title: 'Inventario',
      description: 'Administra todos los productos de tu hogar',
      action: () => navigate('/inventario'),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      icon: ShoppingCart,
      title: 'Listas de Compra',
      description: 'Crea y organiza tus listas de compras',
      action: () => navigate('/listas-compra'),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Reportes',
      description: 'Visualiza estadísticas de tu inventario',
      action: () => navigate('/reportes'),
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header de bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              ¡Bienvenido, {user?.username}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Optimiza el inventario de tu hogar. Evita compras duplicadas y reduce el desperdicio.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
              <Package className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Grupos Activos</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Listas Activas</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Por Vencer</p>
              <p className="text-2xl font-bold text-orange-600">8</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Funcionalidades principales */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ¿Qué quieres hacer hoy?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={feature.action}
              >
                <div className={`${feature.color} ${feature.hoverColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {feature.description}
                </p>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.action();
                  }}
                  className="w-full text-sm"
                  variant="outline"
                >
                  Acceder
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => navigate('/grupos-familiares')}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear Grupo Familiar
          </Button>
          
          <Button
            onClick={() => navigate('/inventario')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Agregar Producto
          </Button>
          
          <Button
            onClick={() => navigate('/listas-compra')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Nueva Lista
          </Button>
        </div>
      </div>
    </div>
  );
};