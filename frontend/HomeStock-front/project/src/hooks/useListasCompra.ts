import { useEffect, useState, useCallback } from 'react';
import { ListaCompra, ProductoLista } from '../types/listaCompra';
import { listaCompraService } from '../services/listaCompraService';

interface UseListasCompraResult {
  listas: ListaCompra[];
  selectedLista: ListaCompra | null;
  loading: boolean;
  error: string | null;
  fetchListas: (grupoFamiliarId: string) => Promise<void>;
  selectLista: (id: string | null) => Promise<void>;
  crearLista: (nombre: string, descripcion?: string) => Promise<void>;
  eliminarLista: (id: string) => Promise<void>;
  agregarProducto: (listaId: string, producto: Omit<ProductoLista, 'comprado'>) => Promise<void>;
  eliminarProducto: (listaId: string, nombreProducto: string) => Promise<void>;
  marcarProducto: (listaId: string, nombreProducto: string, comprado: boolean) => Promise<void>;
}

export function useListasCompra(initialGrupoId?: string): UseListasCompraResult {
  const [listas, setListas] = useState<ListaCompra[]>([]);
  const [selectedLista, setSelectedLista] = useState<ListaCompra | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListas = useCallback(async (grupoFamiliarId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listaCompraService.obtenerListasPorGrupo(grupoFamiliarId);
      setListas(data);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const selectLista = useCallback(async (id: string | null) => {
    if (!id) {
      setSelectedLista(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Intentar seleccionar de forma optimista si ya está en la lista local
      const local = listas.find((l) => l.id === id);
      if (local) {
        setSelectedLista(local);
      }

      // Cargar la versión completa desde el backend (productos, etc.)
      const lista = await listaCompraService.obtenerListaPorId(id);
      setSelectedLista(lista);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [listas]);

  const crearLista = useCallback(async (nombre: string, descripcion?: string) => {
    setLoading(true);
    setError(null);
    try {
      const nueva = await listaCompraService.crearLista(nombre, descripcion);
      setListas((s) => [nueva, ...s]);
    } catch (err: any) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarLista = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await listaCompraService.eliminarLista(id);
      setListas((s) => s.filter((l) => l.id !== id));
      if (selectedLista?.id === id) setSelectedLista(null);
    } catch (err: any) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedLista]);

  const agregarProducto = useCallback(async (listaId: string, producto: Omit<ProductoLista, 'comprado'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await listaCompraService.agregarProducto(listaId, producto);
      setListas((s) => s.map((l) => (l.id === updated.id ? updated : l)));
      setSelectedLista((s) => (s && s.id === updated.id ? updated : s));
    } catch (err: any) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarProducto = useCallback(async (listaId: string, nombreProducto: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await listaCompraService.eliminarProducto(listaId, nombreProducto);
      setListas((s) => s.map((l) => (l.id === updated.id ? updated : l)));
      setSelectedLista((s) => (s && s.id === updated.id ? updated : s));
    } catch (err: any) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarProducto = useCallback(async (listaId: string, nombreProducto: string, comprado: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await listaCompraService.marcarProductoComprado(listaId, nombreProducto, comprado);
      setListas((s) => s.map((l) => (l.id === updated.id ? updated : l)));
      setSelectedLista((s) => (s && s.id === updated.id ? updated : s));
    } catch (err: any) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialGrupoId) fetchListas(initialGrupoId);
  }, [initialGrupoId, fetchListas]);

  return {
    listas,
    selectedLista,
    loading,
    error,
    fetchListas,
    selectLista,
    crearLista,
    eliminarLista,
    agregarProducto,
    eliminarProducto,
    marcarProducto,
  };
}
