import axios from 'axios';
import { Categoria, CrearCategoriaRequest } from '../types/categoria';

const API_BASE_URL = 'https://home-inventory-58978808961.northamerica-south1.run.app/api/v1/';
//const API_BASE_URL = 'http://localhost:8080/api/v1/';

class CategoriaService {
  private readonly endpoint = '/categorias';
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Configurar interceptor para añadir token de autenticación
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Obtiene todas las categorías
   */
  async obtenerCategorias(): Promise<Categoria[]> {
    try {
      const response = await this.client.get<Categoria[]>(this.endpoint);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener categorías:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener las categorías'
      );
    }
  }

  /**
   * Crea una nueva categoría
   */
  async crearCategoria(data: CrearCategoriaRequest): Promise<Categoria> {
    try {
      const response = await this.client.post<Categoria>(this.endpoint, data);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear categoría:', error);
      
      // Manejo específico de errores del backend
      if (error.response?.status === 400) {
        throw new Error(
          error.response.data?.message || 
          'Ya existe una categoría con ese nombre'
        );
      }
      
      throw new Error(
        error.response?.data?.message || 
        'Error al crear la categoría'
      );
    }
  }

  /**
   * Elimina una categoría por nombre
   */
  async eliminarCategoria(nombre: string): Promise<void> {
    try {
      // Normalizar el nombre para enviar al backend
      const nombreNormalizado = nombre.toLowerCase().trim();
      await this.client.delete(`${this.endpoint}/${encodeURIComponent(nombreNormalizado)}`);
    } catch (error: any) {
      console.error('Error al eliminar categoría:', error);
      
      // Manejo específico de errores del backend
      if (error.response?.status === 404) {
        throw new Error(
          error.response.data?.message || 
          'No existe una categoría con ese nombre'
        );
      }
      
      throw new Error(
        error.response?.data?.message || 
        'Error al eliminar la categoría'
      );
    }
  }
}

export const categoriaService = new CategoriaService();