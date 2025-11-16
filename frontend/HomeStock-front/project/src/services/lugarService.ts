import axios from 'axios';
import { Lugar, CrearLugarRequest, Producto } from '../types/lugar';

const API_BASE_URL = 'http://localhost:8080/api/v1/lugares';

class LugarService {
  
  /**
   * Crear un nuevo lugar
   */
  async crearLugar(nombre: string, descripcion: string, grupoFamiliarId: string, userId: string): Promise<Lugar> {
    try {
      console.log('🔄 Creando lugar con los siguientes datos:');
      console.log('  - Nombre:', nombre);
      console.log('  - Descripción:', descripcion);
      console.log('  - Grupo Familiar ID:', grupoFamiliarId);
      console.log('  - User ID (creadoPor):', userId);
      console.log('  - Tipo de User ID:', typeof userId);
      
      const lugarData: CrearLugarRequest = {
        nombre,
        descripcion,
        grupoFamiliarId,
        userId
      };

      const response = await axios.post<Lugar>(API_BASE_URL, lugarData);

      console.log('✅ Lugar creado exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creando lugar:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el lugar';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener todos los lugares de un grupo familiar
   */
  async obtenerLugaresPorGrupo(grupoFamiliarId: string): Promise<Lugar[]> {
    try {
      console.log('🔄 Obteniendo lugares del grupo:', grupoFamiliarId);
      
      const response = await axios.get<Lugar[]>(`${API_BASE_URL}/grupo/${grupoFamiliarId}`);

      console.log('✅ Lugares obtenidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo lugares del grupo:', error);
      
      // Si es un 404, devolver array vacío
      if (error.response?.status === 404) {
        return [];
      }
      
      const errorMessage = error.response?.data?.message || 'Error al obtener los lugares';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener un lugar específico por ID
   */
  async obtenerLugarPorId(lugarId: string): Promise<Lugar> {
    try {
      console.log('🔄 Obteniendo lugar por ID:', lugarId);
      
      const response = await axios.get<Lugar>(`${API_BASE_URL}/${lugarId}`);

      console.log('✅ Lugar obtenido:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo lugar:', error);
      const errorMessage = error.response?.data?.message || 'Error al obtener el lugar';
      throw new Error(errorMessage);
    }
  }

  /**
   * Eliminar un lugar
   */
  async eliminarLugar(lugarId: string): Promise<void> {
    try {
      console.log('🔄 Eliminando lugar:', lugarId);
      
      await axios.delete(`${API_BASE_URL}/${lugarId}`);

      console.log('✅ Lugar eliminado exitosamente');
    } catch (error: any) {
      console.error('❌ Error eliminando lugar:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar el lugar';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener todos los productos de un lugar
   */
  async obtenerProductosPorLugar(lugarId: string): Promise<Producto[]> {
    try {
      console.log('🔄 Obteniendo productos del lugar:', lugarId);
      
      const response = await axios.get<Producto[]>(`${API_BASE_URL}/${lugarId}/productos`);

      console.log('✅ Productos obtenidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo productos del lugar:', error);
      
      // Si es un 404, devolver array vacío
      if (error.response?.status === 404) {
        return [];
      }
      
      const errorMessage = error.response?.data?.message || 'Error al obtener los productos del lugar';
      throw new Error(errorMessage);
    }
  }
}

export const lugarService = new LugarService();