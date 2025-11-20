import { useState, useEffect } from 'react';
import { categoriaService } from '../services/categoriaService';
import { Categoria, CrearCategoriaRequest } from '../types/categoria';

export interface UseCategorias {
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  crearCategoria: (data: CrearCategoriaRequest) => Promise<void>;
  eliminarCategoria: (nombre: string) => Promise<void>;
  recargarCategorias: () => Promise<void>;
}

export const useCategorias = (): UseCategorias => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriaService.obtenerCategorias();
      setCategorias(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error al cargar categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearCategoria = async (data: CrearCategoriaRequest) => {
    try {
      setError(null);
      const nuevaCategoria = await categoriaService.crearCategoria(data);
      setCategorias(prev => [...prev, nuevaCategoria]);
    } catch (err: any) {
      setError(err.message);
      throw err; // Re-lanzar para que el componente pueda manejarlo
    }
  };

  const eliminarCategoria = async (nombre: string) => {
    try {
      setError(null);
      await categoriaService.eliminarCategoria(nombre);
      setCategorias(prev => prev.filter(cat => cat.nombre.toLowerCase() !== nombre.toLowerCase()));
    } catch (err: any) {
      setError(err.message);
      throw err; // Re-lanzar para que el componente pueda manejarlo
    }
  };

  const recargarCategorias = async () => {
    await cargarCategorias();
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,
    crearCategoria,
    eliminarCategoria,
    recargarCategorias,
  };
};