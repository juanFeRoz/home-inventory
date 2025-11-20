import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Categoria } from '../../types/categoria';
import { ConfirmModal } from './ConfirmModal';

interface CategoriaListaProps {
  categorias: Categoria[];
  onEliminar: (nombre: string) => Promise<void>;
  loading?: boolean;
}

export const CategoriaLista: React.FC<CategoriaListaProps> = ({
  categorias,
  onEliminar,
  loading = false,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<Categoria | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // Filtrar categorías basado en la búsqueda
  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    categoria.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminarClick = (categoria: Categoria) => {
    setCategoriaAEliminar(categoria);
  };

  const handleConfirmarEliminacion = async () => {
    if (!categoriaAEliminar) return;

    try {
      setEliminando(true);
      await onEliminar(categoriaAEliminar.nombre);
      setCategoriaAEliminar(null);
    } catch (error) {
      // El error será manejado por el componente padre
    } finally {
      setEliminando(false);
    }
  };

  const handleCancelarEliminacion = () => {
    setCategoriaAEliminar(null);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando categorías...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Categorías ({categorias.length})</h2>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Buscar categorías..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {categorias.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No hay categorías creadas</p>
            <p className="text-sm text-gray-400">Crea tu primera categoría usando el formulario de arriba</p>
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron categorías que coincidan con la búsqueda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Descripción</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categoriasFiltradas.map((categoria) => (
                  <tr key={categoria.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900 capitalize">
                        {categoria.nombre}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">
                        {categoria.descripcion || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleEliminarClick(categoria)}
                        className="bg-white text-red-600 border border-red-300 hover:bg-red-50 hover:text-black"
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={!!categoriaAEliminar}
        onClose={handleCancelarEliminacion}
        onConfirm={handleConfirmarEliminacion}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${categoriaAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={eliminando}
      />
    </>
  );
};