import React, { useState, useEffect } from 'react';
import { lugarService } from '../../services/lugarService';
import { LugarDetalleState } from '../../types/lugar';
import { Button } from '../ui/button';
import { MapPin, ArrowLeft, Calendar, Package, Trash2, Loader, AlertCircle, User, Plus, RefreshCw, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { useProductos } from '../../hooks/useProductos';
import { CrearProductoModal, ProductoLista } from '../productos';
import { CrearProductoRequest } from '../../services/productoService';

// Componente para mostrar información del creador en detalle
const CreatorDetailInfo: React.FC<{ 
  creadoPor: string; 
  currentUserId: string; 
}> = ({ creadoPor, currentUserId }) => {
  const [creatorInfo, setCreatorInfo] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  const isOwner = creadoPor === currentUserId;
  
  useEffect(() => {
    if (creadoPor && !isOwner) {
      setLoading(true);
      authService.getUserInfo(creadoPor)
        .then(info => {
          setCreatorInfo(info);
        })
        .catch(error => {
          console.error('Error obteniendo info del creador:', error);
          setCreatorInfo({ username: 'Usuario desconocido', email: '' });
        })
        .finally(() => setLoading(false));
    }
  }, [creadoPor, isOwner]);
  
  if (loading) {
    return (
      <div className="flex items-center text-gray-500">
        <User className="w-4 h-4 mr-2" />
        <span>Cargando...</span>
      </div>
    );
  }
  
  if (isOwner) {
    return (
      <div className="flex items-center text-green-600">
        <User className="w-4 h-4 mr-2" />
        <span>Ti</span>
        <span className="ml-2 text-sm font-medium">(Tú)</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-blue-600">
      <User className="w-4 h-4 mr-2" />
      <span>{creatorInfo?.username || 'Usuario desconocido'}</span>
    </div>
  );
};

interface LugarDetalleProps {
  lugarId: string;
  currentUserId: string;
  onBack: () => void;
  onDeleteLugar: (lugarId: string) => void;
}

export const LugarDetalle: React.FC<LugarDetalleProps> = ({
  lugarId,
  currentUserId,
  onBack,
  onDeleteLugar,
}) => {
  const [state, setState] = useState<LugarDetalleState>({
    lugar: null,
    productos: [],
    isLoading: true,
    error: null,
  });

  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hook para gestión de productos
  const {
    state: productosState,
    crearProducto,
    reducirCantidad,
    eliminarCompleto,
    asignarCategoria,
    recargarProductos,
  } = useProductos();

  useEffect(() => {
    loadLugarDetalle();
  }, [lugarId]);

  // Limpiar mensajes después de un tiempo
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const loadLugarDetalle = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Cargar lugar y productos en paralelo
      const [lugar, productos] = await Promise.all([
        lugarService.obtenerLugarPorId(lugarId),
        lugarService.obtenerProductosPorLugar(lugarId)
      ]);

      setState({
        lugar,
        productos,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('❌ Error cargando detalle del lugar:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al cargar el lugar',
      }));
    }
  };

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

  const handleCrearProducto = async (lugarId: string, productoData: CrearProductoRequest) => {
    await crearProducto(lugarId, productoData);
    // Recargar también el detalle del lugar para actualizar el contador
    await loadLugarDetalle();
  };

  const handleProductoSuccess = (message: string) => {
    setSuccessMessage(message);
    // Recargar el detalle del lugar para actualizar contadores
    loadLugarDetalle();
  };

  const handleProductoError = (error: string) => {
    setErrorMessage(error);
  };

  // Usar los productos del lugar actual (del estado del lugar)
  const productosDelLugar = state.productos || [];

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Cargando lugar...</p>
        </div>
      </div>
    );
  }

  if (state.error || !state.lugar) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-red-800">Error</h3>
        </div>
        <p className="text-red-700 mb-4">{state.error || 'Lugar no encontrado'}</p>
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista
        </Button>
      </div>
    );
  }

  const { lugar, productos } = state;
  const isOwner = lugar.creadoPor === currentUserId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lugar.nombre}</h1>
                <p className="text-gray-600">Detalle del lugar</p>
              </div>
            </div>
          </div>

          {isOwner && (
            <Button
              onClick={() => onDeleteLugar(lugar.id)}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Lugar
            </Button>
          )}
        </div>
      </div>

      {/* Información del lugar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Información</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Descripción */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Descripción</h3>
            <p className="text-gray-900">
              {lugar.descripcion || 'Sin descripción'}
            </p>
          </div>

          {/* Fecha de creación */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Fecha de creación</h3>
            <div className="flex items-center text-gray-900">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              {formatDate(lugar.fechaCreacion)}
            </div>
          </div>

          {/* Creado por */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Creado por</h3>
            <CreatorDetailInfo 
              creadoPor={lugar.creadoPor} 
              currentUserId={currentUserId} 
            />
          </div>

          {/* Estadísticas */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Productos</h3>
            <div className="flex items-center text-gray-900">
              <Package className="w-4 h-4 mr-2 text-gray-500" />
              {productos.length} producto{productos.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de éxito/error */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{errorMessage}</span>
        </div>
      )}

      {/* Header de productos con botón crear */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Gestión de Productos
          </h2>
          
          <div className="flex gap-3">
            <Button
              onClick={() => recargarProductos()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </Button>
            
            <Button
              onClick={() => setShowCreateProductModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Producto
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de productos con gestión completa */}
      <ProductoLista
        productos={productosDelLugar}
        isLoading={productosState.isLoading}
        onReducirCantidad={async (productoId: string) => {
          await reducirCantidad(productoId);
          handleProductoSuccess('Cantidad reducida correctamente');
        }}
        onEliminarCompleto={async (productoId: string) => {
          await eliminarCompleto(productoId);
          handleProductoSuccess('Producto eliminado correctamente');
        }}
        onAsignarCategoria={async (productoId: string, categoria: string) => {
          await asignarCategoria(productoId, categoria);
          handleProductoSuccess('Categoría asignada correctamente');
        }}
      />

      {/* Modal para crear producto */}
      <CrearProductoModal
        isOpen={showCreateProductModal}
        onClose={() => setShowCreateProductModal(false)}
        lugarId={lugarId}
        lugarNombre={lugar.nombre}
        onSuccess={() => handleProductoSuccess('Producto creado correctamente')}
        onError={handleProductoError}
        onCrearProducto={handleCrearProducto}
      />
    </div>
  );
};