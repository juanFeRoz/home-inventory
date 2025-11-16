import axios from 'axios';
import { 
  GrupoFamiliar, 
  CrearGrupoRequest, 
  AgregarMiembroRequest
} from '../types/grupoFamiliar';

const API_BASE_URL = 'http://localhost:8080/api/v1/grupos-familiares';

class GrupoFamiliarService {
  
  /**
   * Crear un nuevo grupo familiar
   */
  async crearGrupo(grupoData: CrearGrupoRequest): Promise<GrupoFamiliar> {
    try {
      console.log('🔄 Creando grupo familiar:', grupoData);
      
      const response = await axios.post<GrupoFamiliar>(API_BASE_URL, grupoData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Grupo creado exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creando grupo:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el grupo familiar';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener el ID del grupo familiar del usuario autenticado
   */
  async obtenerMiGrupo(): Promise<string> {
    try {
      console.log('🔄 Obteniendo mi grupo familiar...');
      
      const response = await axios.get<string>(`${API_BASE_URL}/mi-grupo`);

      console.log('✅ Mi grupo ID obtenido:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo mi grupo:', error);
      
      // Si es un 404, significa que el usuario no tiene grupo
      if (error.response?.status === 404) {
        throw new Error('NO_GROUP');
      }
      
      const errorMessage = error.response?.data?.message || 'Error al obtener el grupo';
      throw new Error(errorMessage);
    }
  }



  /**
   * Agregar un miembro al grupo
   */
  async agregarMiembro(grupoId: string, miembroData: AgregarMiembroRequest): Promise<GrupoFamiliar> {
    try {
      console.log('🔄 Agregando miembro al grupo:', { grupoId, username: miembroData.username });
      
      const response = await axios.post<GrupoFamiliar>(`${API_BASE_URL}/${grupoId}/miembros`, miembroData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Miembro agregado exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error agregando miembro:', error);
      const errorMessage = error.response?.data?.message || 'Error al agregar el miembro';
      throw new Error(errorMessage);
    }
  }

  /**
   * Eliminar un miembro del grupo
   */
  async eliminarMiembro(grupoId: string, username: string): Promise<void> {
    try {
      console.log('🔄 Eliminando miembro del grupo:', { grupoId, username });
      
      await axios.delete(`${API_BASE_URL}/${grupoId}/miembros/${username}`);

      console.log('✅ Miembro eliminado exitosamente');
    } catch (error: any) {
      console.error('❌ Error eliminando miembro:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar el miembro';
      throw new Error(errorMessage);
    }
  }

  /**
   * Eliminar el grupo completo
   */
  async eliminarGrupo(grupoId: string): Promise<void> {
    try {
      console.log('🔄 Eliminando grupo:', grupoId);
      
      await axios.delete(`${API_BASE_URL}/${grupoId}`);

      console.log('✅ Grupo eliminado exitosamente');
    } catch (error: any) {
      console.error('❌ Error eliminando grupo:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar el grupo';
      throw new Error(errorMessage);
    }
  }

  /**
   * Verificar si el usuario actual es el creador del grupo
   */
  esCreadorDelGrupo(grupo: GrupoFamiliar, currentUserId: string): boolean {
    return grupo.creador.id === currentUserId;
  }

  /**
   * Verificar si un usuario es miembro del grupo
   */
  esMiembroDelGrupo(grupo: GrupoFamiliar, username: string): boolean {
    return grupo.miembros.some(miembro => miembro.username === username);
  }

  /**
   * Obtener el rol del usuario actual en el grupo
   */
  obtenerRolUsuario(grupo: GrupoFamiliar, currentUserId: string): 'creador' | 'miembro' | 'no_miembro' {
    if (grupo.creador.id === currentUserId) {
      return 'creador';
    }
    
    const esMiembro = grupo.miembros.some(miembro => miembro.id === currentUserId);
    return esMiembro ? 'miembro' : 'no_miembro';
  }
}

export const grupoFamiliarService = new GrupoFamiliarService();