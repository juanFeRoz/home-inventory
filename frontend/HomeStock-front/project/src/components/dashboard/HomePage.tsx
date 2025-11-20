import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { grupoFamiliarService } from '../../services/grupoFamiliarService';
import { Button } from '../ui/button';
import { Users, Package, ShoppingCart, Plus, BarChart3, MapPin } from 'lucide-react';
import { listaCompraService } from '../../services/listaCompraService';
import { lugarService } from '../../services/lugarService';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasGroup, setHasGroup] = useState<boolean | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [listCount, setListCount] = useState<number | null>(null);
  const [placeCount, setPlaceCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const checkGroup = async () => {
      try {
        const currentUsername = user?.username || '';
        const grupo = await grupoFamiliarService.obtenerGrupoCompleto(currentUsername);
        if (mounted) {
          setHasGroup(true);
          setGroupName(grupo?.nombre || null);
          setProductCount(typeof grupo?.cantidadProductos === 'number' ? grupo.cantidadProductos : null);
          try {
            if (grupo?.id) {
              const listas = await listaCompraService.obtenerListasPorGrupo(grupo.id);
              if (mounted) setListCount(Array.isArray(listas) ? listas.length : null);

              try {
                const lugares = await lugarService.obtenerLugaresPorGrupo(grupo.id);
                if (mounted) setPlaceCount(Array.isArray(lugares) ? lugares.length : null);
              } catch (errLugares) {
                console.error('Error obteniendo lugares del grupo:', errLugares);
                if (mounted) setPlaceCount(null);
              }
            } else {
              if (mounted) {
                setListCount(null);
                setPlaceCount(null);
              }
            }
          } catch (err) {
            console.error('Error obteniendo listas del grupo:', err);
            if (mounted) {
              setListCount(null);
              setPlaceCount(null);
            }
          }
        }
      } catch (err: any) {
        if (mounted) {
          if (err?.message === 'NO_GROUP') {
            setHasGroup(false);
            setGroupName(null);
            setProductCount(null);
          } else {
            console.error('Error comprobando grupo:', err);
            setHasGroup(false);
            setGroupName(null);
            setProductCount(null);
          }
        }
      }
    };
    checkGroup();
    return () => { mounted = false; };
  }, []);

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
      icon: MapPin,
      title: 'Lugares',
      description: 'Organiza el inventario en los espacios de tu hogar para mejor gestión',
      action: () => navigate('/lugares'),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      icon: ShoppingCart,
      title: 'Listas de Compra',
      description: 'Crea, organiza y adiciona productos a tus listas de compras',
      action: () => navigate('/listas-compra'),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
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
              <p className="text-sm text-gray-600">Grupo Activo</p>
              <p className="text-xl font-bold text-blue-600">{groupName ?? '—'}</p>
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
              <p className="text-xl font-bold text-orange-600">{productCount ?? '—'}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Listas Activas</p>
              <p className="text-xl font-bold text-purple-600">{listCount ?? '—'}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lugares Activos</p>
              <p className="text-xl font-bold text-green-600">{placeCount ?? '—'}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Funcionalidades principales */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ¿Qué quieres hacer hoy?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group max-w-sm w-full"
                onClick={feature.action}
              >
                <div className={`${feature.color} ${feature.hoverColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 mx-auto`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 text-center">
                  {feature.description}
                </p>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.action();
                  }}
                  className="w-full text-base py-3"
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
            {hasGroup === null ? 'Grupos Familiares' : hasGroup ? 'Mi grupo' : 'Crear Grupo Familiar'}
          </Button>
          
          <Button
            onClick={() => navigate('/lugares')}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          >
            <Package className="w-4 h-4 text-white" />
            Agregar Producto
          </Button>
          
          <Button
            onClick={() => navigate('/listas-compra')}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            Nueva Lista
          </Button>
        </div>
      </div>
    </div>
  );
};