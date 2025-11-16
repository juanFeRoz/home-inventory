import React, { useState, useEffect } from 'react';
import { Lugar } from '../../types/lugar';
import { Button } from '../ui/button';
import { MapPin, Eye, Trash2, Calendar, Package, User } from 'lucide-react';
import { authService } from '../../services/authService';

// Componente para mostrar información del creador
const CreatorInfo: React.FC<{ 
  creadoPor: string; 
  currentUserId: string; 
}> = ({ creadoPor, currentUserId }) => {
  const [creatorInfo, setCreatorInfo] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  const isOwner = checkOwnership(creadoPor, currentUserId);
  
  useEffect(() => {
    if (creadoPor) {
      console.log('🔄 Obteniendo info para creador:', creadoPor, 'isOwner:', isOwner);
      
      // Siempre obtener la información, incluso para el owner
      setLoading(true);
      authService.getUserInfo(creadoPor)
        .then(info => {
          console.log('✅ Info obtenida para', creadoPor, ':', info);
          setCreatorInfo(info);
        })
        .catch(error => {
          console.error('❌ Error obteniendo info del creador:', error);
          setCreatorInfo({ username: 'Usuario desconocido', email: '' });
        })
        .finally(() => setLoading(false));
    }
  }, [creadoPor, isOwner]);
  
  if (loading) {
    return (
      <span className="text-xs text-gray-400 flex items-center gap-1">
        <User className="w-3 h-3" />
        Cargando...
      </span>
    );
  }
  
  if (isOwner) {
    return (
      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
        <User className="w-3 h-3" />
        Creado por ti
      </span>
    );
  }
  
  return (
    <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
      <User className="w-3 h-3" />
      Creado por {creatorInfo?.username || 'Usuario'}
    </span>
  );
};

// Función utilitaria para verificar propiedad de lugar
const checkOwnership = (creadoPor: string, currentUserId: string): boolean => {
  if (!creadoPor || !currentUserId) return false;
  
  // Comparación exacta (caso ideal)
  if (creadoPor === currentUserId) return true;
  
  // Comparaciones flexibles para casos de inconsistencia de IDs
  
  // 1. Verificar si ambos contienen partes comunes (excluyendo timestamps)
  const creadorParts = creadoPor.split('-');
  const currentParts = currentUserId.split('-');
  
  // Si ambos tienen formato user-nombre-hash, comparar por nombre
  if (creadorParts.length >= 3 && currentParts.length >= 3) {
    const creadorUsername = creadorParts[1];
    const currentUsername = currentParts[1];
    if (creadorUsername && currentUsername && creadorUsername === currentUsername) {
      console.log('✅ Coincidencia por username:', creadorUsername);
      return true;
    }
  }
  
  // 2. Verificar si uno contiene al otro (para casos de formato diferente)
  if (creadoPor.includes(currentUserId.replace('user-', '')) || 
      currentUserId.includes(creadoPor.replace('user-', ''))) {
    console.log('✅ Coincidencia por inclusión parcial');
    return true;
  }
  
  // 3. Debug para casos no coincidentes
  console.log('❌ No hay coincidencia:', { creadoPor, currentUserId });
  return false;
};

interface LugarListaProps {
  lugares: Lugar[];
  currentUserId: string;
  onViewLugar: (lugarId: string) => void;
  onDeleteLugar: (lugarId: string) => void;
}

export const LugarLista: React.FC<LugarListaProps> = ({
  lugares,
  currentUserId,
  onViewLugar,
  onDeleteLugar,
}) => {
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Fecha no disponible';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha no disponible';
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha no disponible';
    }
  };

  if (lugares.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-10 h-10 text-gray-400" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          No hay lugares creados
        </h2>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Crea tu primer lugar para organizar mejor los productos de tu hogar. 
          Por ejemplo: "Cocina", "Despensa", "Refrigerador", etc.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Lugares del Hogar
        </h2>
        <span className="text-sm text-gray-500">
          {lugares.length} lugar{lugares.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lugares.map((lugar) => {
          // Lógica de permisos más flexible y robusta
          const isOwner = checkOwnership(lugar.creadoPor, currentUserId);
          const productCount = lugar.productos?.length || 0;
          
          return (
            <div
              key={lugar.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Header del lugar */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{lugar.nombre}</h3>
                    <CreatorInfo 
                      creadoPor={lugar.creadoPor} 
                      currentUserId={currentUserId} 
                    />
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="flex gap-1">
                  <Button
                    onClick={() => onViewLugar(lugar.id)}
                    variant="outline"
                    size="sm"
                    className="p-2"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  {isOwner && (
                    <Button
                      onClick={() => onDeleteLugar(lugar.id)}
                      variant="outline"
                      size="sm"
                      className="p-2 text-red-600 border-red-300 hover:bg-red-50"
                      title="Eliminar lugar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Descripción */}
              {lugar.descripcion && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {lugar.descripcion}
                </p>
              )}

              {/* Estadísticas */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-center">
                  <Package className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">
                    {productCount} producto{productCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Fecha de creación */}
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Creado el {formatDate(lugar.fechaCreacion)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};