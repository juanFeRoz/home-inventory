import React, { useState } from 'react';
import { Producto } from '../../services/productoService';
import { Button } from '../ui/button';
import { 
  Package, 
  Minus, 
  Trash2, 
  Tag, 
  Calendar, 
  AlertTriangle,
  Clock,
  Hash
} from 'lucide-react';

interface ProductoListaProps {
  productos: Producto[];
  isLoading: boolean;
  onReducirCantidad: (productoId: string) => Promise<void>;
  onEliminarCompleto: (productoId: string) => Promise<void>;
  onAsignarCategoria: (productoId: string, categoria: string) => Promise<void>;
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface AsignarCategoriaModalProps {
  isOpen: boolean;
  producto: Producto | null;
  onClose: () => void;
  onAsignar: (categoria: string) => Promise<void>;
}

const AsignarCategoriaModal: React.FC<AsignarCategoriaModalProps> = ({
  isOpen,
  producto,
  onClose,
  onAsignar,
}) => {
  const [categoria, setCategoria] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categoriasSugeridas = ['Cereales', 'Lácteos', 'Carnes', 'Verduras', 'Frutas', 'Bebidas', 'Limpieza', 'Higiene'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria.trim()) return;

    try {
      setIsLoading(true);
      await onAsignar(categoria.trim());
      setCategoria('');
      onClose();
    } catch (error) {
      console.error('Error asignando categoría:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Asignar Categoría
        </h3>
        <p className="text-gray-600 mb-4">
          Producto: <span className="font-medium">{producto.nombre}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de la categoría"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Categorías sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {categoriasSugeridas.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || !categoria.trim()}
            >
              {isLoading ? 'Asignando...' : 'Asignar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ProductoLista: React.FC<ProductoListaProps> = ({
  productos,
  isLoading,
  onReducirCantidad,
  onEliminarCompleto,
  onAsignarCategoria,
}) => {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'reducir' | 'eliminar';
    producto: Producto | null;
  }>({ isOpen: false, type: 'reducir', producto: null });

  const [categoriaModal, setCategoriaModal] = useState<{
    isOpen: boolean;
    producto: Producto | null;
  }>({ isOpen: false, producto: null });

  const formatearFecha = (fechaISO: string): string => {
    if (!fechaISO) return 'Sin fecha';
    
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const estaProximoAVencer = (fechaISO: string): boolean => {
    if (!fechaISO) return false;
    
    try {
      const fecha = new Date(fechaISO);
      const hoy = new Date();
      const diasRestantes = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      
      return diasRestantes <= 7 && diasRestantes >= 0;
    } catch (error) {
      return false;
    }
  };

  const estaVencido = (fechaISO: string): boolean => {
    if (!fechaISO) return false;
    
    try {
      const fecha = new Date(fechaISO);
      const hoy = new Date();
      
      return fecha < hoy;
    } catch (error) {
      return false;
    }
  };

  const estaEnMinimo = (producto: Producto): boolean => {
    return producto.cantidad <= producto.cantidadMinima;
  };

  const handleReducirCantidad = async (producto: Producto) => {
    setConfirmModal({ isOpen: false, type: 'reducir', producto: null });
    
    try {
      await onReducirCantidad(producto.id);
    } catch (error) {
      console.error('Error reduciendo cantidad:', error);
    }
  };

  const handleEliminarCompleto = async (producto: Producto) => {
    setConfirmModal({ isOpen: false, type: 'eliminar', producto: null });
    
    try {
      await onEliminarCompleto(producto.id);
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  };

  const handleAsignarCategoria = async (categoria: string) => {
    if (!categoriaModal.producto) return;
    
    try {
      await onAsignarCategoria(categoriaModal.producto.id, categoria);
    } catch (error) {
      console.error('Error asignando categoría:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Package className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          No hay productos
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Aún no tienes productos registrados. Crea tu primer producto para comenzar a gestionar tu inventario.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Productos ({productos.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {productos.map((producto) => {
            const proximoAVencer = estaProximoAVencer(producto.expiracion);
            const vencido = estaVencido(producto.expiracion);
            const enMinimo = estaEnMinimo(producto);

            return (
              <div key={producto.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{producto.nombre}</h4>
                      
                      {/* Badges de estado */}
                      {vencido && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Vencido
                        </span>
                      )}
                      
                      {!vencido && proximoAVencer && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Por vencer
                        </span>
                      )}
                      
                      {enMinimo && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Stock mínimo
                        </span>
                      )}
                    </div>

                    {producto.descripcion && (
                      <p className="text-gray-600 text-sm mb-3">{producto.descripcion}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Hash className="w-4 h-4" />
                        <span>Cantidad: <strong>{producto.cantidad}</strong></span>
                        {producto.cantidadMinima > 0 && (
                          <span>(mín: {producto.cantidadMinima})</span>
                        )}
                      </div>

                      {producto.expiracion && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Vence: {formatearFecha(producto.expiracion)}</span>
                        </div>
                      )}

                      {producto.categoria && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {producto.categoria.nombre}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => setCategoriaModal({ isOpen: true, producto })}
                      variant="outline"
                      size="sm"
                      className="p-2"
                      title="Asignar categoría"
                    >
                      <Tag className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => setConfirmModal({ isOpen: true, type: 'reducir', producto })}
                      variant="outline"
                      size="sm"
                      className="p-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                      title="Reducir cantidad (-1)"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => setConfirmModal({ isOpen: true, type: 'eliminar', producto })}
                      variant="outline"
                      size="sm"
                      className="p-2 text-red-600 border-red-300 hover:bg-red-50"
                      title="Eliminar completamente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.type === 'reducir' 
            ? 'Reducir cantidad' 
            : 'Eliminar producto'
        }
        message={
          confirmModal.type === 'reducir'
            ? `¿Estás seguro de que quieres reducir la cantidad de "${confirmModal.producto?.nombre}" en 1 unidad?${
                confirmModal.producto?.cantidad === 1 
                  ? ' Al ser la última unidad, el producto será eliminado completamente.' 
                  : ''
              }`
            : `¿Estás seguro de que quieres eliminar completamente "${confirmModal.producto?.nombre}"? Esta acción no se puede deshacer.`
        }
        confirmText={confirmModal.type === 'reducir' ? 'Reducir' : 'Eliminar'}
        cancelText="Cancelar"
        onConfirm={() => {
          if (confirmModal.producto) {
            if (confirmModal.type === 'reducir') {
              handleReducirCantidad(confirmModal.producto);
            } else {
              handleEliminarCompleto(confirmModal.producto);
            }
          }
        }}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'reducir', producto: null })}
        isDestructive={confirmModal.type === 'eliminar'}
      />

      {/* Modal para asignar categoría */}
      <AsignarCategoriaModal
        isOpen={categoriaModal.isOpen}
        producto={categoriaModal.producto}
        onClose={() => setCategoriaModal({ isOpen: false, producto: null })}
        onAsignar={handleAsignarCategoria}
      />
    </>
  );
};