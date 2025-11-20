import React, { useState } from 'react';
import { CrearCategoriaForm } from './CrearCategoriaForm';
import { CategoriaLista } from './CategoriaLista';
import { useCategorias } from '../../hooks/useCategorias';

export const CategoriaManager: React.FC = () => {
  const {
    categorias,
    loading,
    error,
    crearCategoria,
    eliminarCategoria,
    recargarCategorias,
  } = useCategorias();

  const [mensaje, setMensaje] = useState<{
    tipo: 'success' | 'error';
    texto: string;
  } | null>(null);

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => setMensaje(null), 5000);
  };

  const handleCrearCategoria = async (data: any) => {
    try {
      await crearCategoria(data);
      mostrarMensaje('success', 'Categoría creada exitosamente');
    } catch (error: any) {
      mostrarMensaje('error', error.message);
      throw error; // Re-lanzar para que el formulario pueda manejarlo
    }
  };

  const handleEliminarCategoria = async (nombre: string) => {
    try {
      await eliminarCategoria(nombre);
      mostrarMensaje('success', 'Categoría eliminada exitosamente');
    } catch (error: any) {
      mostrarMensaje('error', error.message);
      throw error; // Re-lanzar para que la lista pueda manejarlo
    }
  };

  const cerrarMensaje = () => {
    setMensaje(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-600 mt-1">
            Crea y administra las categorías para organizar tus productos
          </p>
        </div>
        <button
          onClick={recargarCategorias}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          disabled={loading}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {/* Mensajes de notificación */}
      {mensaje && (
        <div
          className={`p-4 rounded-md border ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex">
              <div className="flex-shrink-0">
                {mensaje.tipo === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{mensaje.texto}</p>
              </div>
            </div>
            <button
              onClick={cerrarMensaje}
              className="ml-4 inline-block text-sm underline hover:no-underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Error global */}
      {error && !mensaje && (
        <div className="p-4 rounded-md border bg-red-50 border-red-200 text-red-800">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de creación */}
      <CrearCategoriaForm
        onSubmit={handleCrearCategoria}
        isLoading={loading}
      />

      {/* Lista de categorías */}
      <CategoriaLista
        categorias={categorias}
        onEliminar={handleEliminarCategoria}
        loading={loading}
      />
    </div>
  );
};