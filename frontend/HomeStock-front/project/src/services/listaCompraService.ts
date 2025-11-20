import axios, { AxiosError } from 'axios';
import { ListaCompra, ProductoLista } from '../types/listaCompra';

const API_BASE = 'http://localhost:8080/api/v1';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// attach token from localStorage for each request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    if (!config.headers) config.headers = {} as any;
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

function handleAxiosError(error: any) {
  if ((error as AxiosError).response) {
    const axiosErr = error as AxiosError;
    return axiosErr.response?.data || axiosErr.response?.statusText || axiosErr.message;
  }
  return error.message || String(error);
}

export const listaCompraService = {
  async crearLista(nombre: string, descripcion?: string): Promise<ListaCompra> {
    try {
      const body = { nombre, descripcion };
      const { data } = await client.post<ListaCompra>('/listas-compra', body);
      return data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  async obtenerListasPorGrupo(grupoFamiliarId: string): Promise<ListaCompra[]> {
    try {
      const { data } = await client.get<ListaCompra[]>(`/listas-compra/grupo/${grupoFamiliarId}`);
      return data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  async obtenerListaPorId(id: string): Promise<ListaCompra> {
    try {
      const { data } = await client.get<ListaCompra>(`/listas-compra/${id}`);
      return data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  async eliminarLista(id: string): Promise<void> {
    try {
      await client.delete(`/listas-compra/${id}`);
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  async agregarProducto(listaId: string, producto: Omit<ProductoLista, 'comprado'> & { comprado?: boolean }): Promise<ListaCompra> {
    try {
      const body = { ...producto, comprado: !!producto.comprado };
      const { data } = await client.post<ListaCompra>(`/listas-compra/${listaId}/productos`, body);
      return data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  async eliminarProducto(listaId: string, nombreProducto: string): Promise<ListaCompra> {
    try {
      const { data } = await client.delete<ListaCompra>(`/listas-compra/${listaId}/productos/${encodeURIComponent(nombreProducto)}`);
      return data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  async marcarProductoComprado(listaId: string, nombreProducto: string, comprado: boolean): Promise<ListaCompra> {
    try {
      const body = { comprado };
      const { data } = await client.patch<ListaCompra>(`/listas-compra/${listaId}/productos/${encodeURIComponent(nombreProducto)}/comprado`, body);
      return data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },
};
