import { useState, useEffect } from 'react';
import { productoService, Producto, CrearProductoRequest } from '../services/productoService';

interface UseProductosState {
  productos: Producto[];
  isLoading: boolean;
  error: string | null;
}

interface UseProductosReturn {
  state: UseProductosState;
  crearProducto: (lugarId: string, productoData: CrearProductoRequest) => Promise<void>;
  reducirCantidad: (productoId: string) => Promise<void>;
  eliminarCompleto: (productoId: string) => Promise<void>;
  asignarCategoria: (productoId: string, categoria: string) => Promise<void>;
  buscarPorNombre: (nombre: string) => Promise<Producto | null>;
  recargarProductos: () => Promise<void>;
  limpiarError: () => void;
}

export const useProductos = (): UseProductosReturn => {
  const [state, setState] = useState<UseProductosState>({
    productos: [],
    isLoading: false,
    error: null,
  });

  // Cargar todos los productos al inicializar
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const productos = await productoService.obtenerTodosLosProductos();
      
      setState({
        productos,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Error cargando productos:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al cargar los productos',
      }));
    }
  };

  const crearProducto = async (lugarId: string, productoData: CrearProductoRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await productoService.crearProducto(lugarId, productoData);
      
      // Recargar productos después de crear
      await cargarProductos();
    } catch (error: any) {
      console.error('Error creando producto:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al crear el producto',
      }));
      throw error; // Re-lanzar para que el componente pueda manejarlo
    }
  };

  const reducirCantidad = async (productoId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await productoService.reducirCantidadProducto(productoId);
      
      // Recargar productos después de reducir cantidad
      await cargarProductos();
    } catch (error: any) {
      console.error('Error reduciendo cantidad:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al reducir la cantidad',
      }));
      throw error;
    }
  };

  const eliminarCompleto = async (productoId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await productoService.eliminarProductoCompleto(productoId);
      
      // Recargar productos después de eliminar
      await cargarProductos();
    } catch (error: any) {
      console.error('Error eliminando producto:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al eliminar el producto',
      }));
      throw error;
    }
  };

  const asignarCategoria = async (productoId: string, categoria: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await productoService.asignarCategoria(productoId, categoria);
      
      // Recargar productos después de asignar categoría
      await cargarProductos();
    } catch (error: any) {
      console.error('Error asignando categoría:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al asignar la categoría',
      }));
      throw error;
    }
  };

  const buscarPorNombre = async (nombre: string): Promise<Producto | null> => {
    try {
      const producto = await productoService.obtenerProductoPorNombre(nombre);
      return producto;
    } catch (error: any) {
      console.error('Error buscando producto por nombre:', error);
      // No actualizar el estado global para búsquedas individuales
      return null;
    }
  };

  const recargarProductos = async () => {
    await cargarProductos();
  };

  const limpiarError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    state,
    crearProducto,
    reducirCantidad,
    eliminarCompleto,
    asignarCategoria,
    buscarPorNombre,
    recargarProductos,
    limpiarError,
  };
};