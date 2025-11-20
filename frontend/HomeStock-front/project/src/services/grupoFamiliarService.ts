import axios from 'axios';
import { 
  GrupoFamiliar, 
  CrearGrupoRequest, 
  AgregarMiembroRequest
} from '../types/grupoFamiliar';

// API_BASE_URL = 'https://home-inventory-58978808961.northamerica-south1.run.app/api/v1/grupos-familiares';
const API_BASE_URL = 'https://home-inventory-58978808961.northamerica-south1.run.app/api/v1/grupos-familiares';

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
      
      // Si es un 404 o 400, significa que el usuario no tiene grupo
      const status = error.response?.status;
      if (status === 404 || status === 400) {
        throw new Error('NO_GROUP');
      }
      
      const errorMessage = error.response?.data?.message || 'Error al obtener el grupo';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener información completa del grupo (nombre, descripción y fecha de creación)
   */
  async obtenerInfoMiGrupo(): Promise<{ nombre: string; descripcion: string; fechaCreacion: string }> {
    try {
      console.log('🔄 Obteniendo información del grupo...');
      
      const response = await axios.get<{ nombre: string; descripcion: string; fechaCreacion: string }>(`${API_BASE_URL}/mi-grupo/nombre`);

      console.log('✅ Información del grupo obtenida:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo información del grupo:', error);
      const errorMessage = error.response?.data?.message || 'Error al obtener la información del grupo';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener cantidad de productos del grupo
   */
  async obtenerCantidadProductos(): Promise<number> {
    try {
      console.log('🔄 Obteniendo cantidad de productos...');
      
      const response = await axios.get<{ cantidadProductos: number }>(`${API_BASE_URL}/mi-grupo/cantidad-productos`);

      console.log('✅ Cantidad de productos obtenida:', response.data.cantidadProductos);
      return response.data.cantidadProductos;
    } catch (error: any) {
      console.error('❌ Error obteniendo cantidad de productos:', error);
      const errorMessage = error.response?.data?.message || 'Error al obtener la cantidad de productos';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener cantidad de miembros del grupo
   */
  async obtenerCantidadMiembros(): Promise<number> {
    try {
      console.log('🔄 Obteniendo cantidad de miembros...');
      
      const response = await axios.get<{ cantidadMiembros: number }>(`${API_BASE_URL}/mi-grupo/cantidad-miembros`);

      console.log('✅ Cantidad de miembros obtenida:', response.data.cantidadMiembros);
      return response.data.cantidadMiembros;
    } catch (error: any) {
      console.error('❌ Error obteniendo cantidad de miembros:', error);
      const errorMessage = error.response?.data?.message || 'Error al obtener la cantidad de miembros';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener lista de miembros del grupo con username y email
   */
  async obtenerMiembrosGrupo(): Promise<Array<{username: string, email: string}>> {
    try {
      console.log('🔄 Obteniendo miembros del grupo...');
      
      const response = await axios.get(`${API_BASE_URL}/mi-grupo/miembros`);

      console.log('✅ Respuesta completa del backend:', response.data);

      console.log('✅ Primer miembro detallado:', JSON.stringify(response.data.miembros?.[0], null, 2));
      
      return response.data.miembros;
    } catch (error: any) {
      console.error('❌ Error obteniendo miembros del grupo:', error);
      const errorMessage = error.response?.data?.message || 'Error al obtener los miembros del grupo';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener información completa del grupo combinando todos los endpoints
   */
  async obtenerGrupoCompleto(currentUsername: string): Promise<any> {
    try {
      console.log('🔄 Obteniendo información completa del grupo...');
      
      // Ejecutar todas las peticiones en paralelo para mejor rendimiento
      const [grupoId, grupoInfo, cantidadProductos, cantidadMiembros, miembros, esCreador] = await Promise.all([
        this.obtenerMiGrupo(),
        this.obtenerInfoMiGrupo(),
        this.obtenerCantidadProductos(),
        this.obtenerCantidadMiembros(),
        this.obtenerMiembrosGrupo(),
        this.esCreadorDelGrupo()
      ]);


      console.log('- Miembros raw:', miembros);
      console.log('- Tipo de miembros:', typeof miembros, Array.isArray(miembros));
      console.log('- Primer miembro raw:', miembros?.[0]);



      // Encontrar el creador real en la lista de miembros
      const creadorReal = miembros.find(miembro => 
        miembro.username && miembro.username !== currentUsername
      ) || miembros[0]; // Fallback al primer miembro si no se encuentra
      
      // Si el usuario actual es creador, usar sus datos, sino usar los del creador real
      const creadorInfo = esCreador 
        ? { username: currentUsername, email: `${currentUsername}@example.com` }
        : creadorReal || { username: 'Desconocido', email: 'desconocido@example.com' };

      // Construir el objeto con la estructura esperada por la interfaz
      const grupoCompleto = {
        id: grupoId,
        nombre: grupoInfo.nombre,
        descripcion: grupoInfo.descripcion,
        creador: {
          id: creadorInfo.username,
          username: creadorInfo.username,
          email: creadorInfo.email
        },
        miembros: miembros.map(miembro => {
          // Extraer username y email del Map de Java serializado
          const username = miembro.username || miembro['username'];
          const email = miembro.email || miembro['email'];
          
          const miembroMapeado = {
            id: username,
            username: username,
            email: email,
            fechaUnion: grupoInfo.fechaCreacion,
            esCreador: username === creadorInfo.username // Usar el creador real
          };
          return miembroMapeado;
        }),
        fechaCreacion: grupoInfo.fechaCreacion, // Usando la fecha real del backend
        // Propiedades adicionales para estadísticas
        cantidadMiembros,
        cantidadProductos,
        // Información de permisos del usuario actual
        usuarioActualEsCreador: esCreador
      };

      console.log('✅ Información completa del grupo obtenida');
      return grupoCompleto;
    } catch (error: any) {
      console.error('❌ Error obteniendo información completa del grupo:', error);
      throw error;
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
   * Verificar si el usuario actual es el creador del grupo usando el backend
   */
  async esCreadorDelGrupo(): Promise<boolean> {
    try {
      console.log('🔄 Verificando si es creador del grupo...');
      
      const response = await axios.get<{ esCreador: boolean }>(`${API_BASE_URL}/mi-grupo/es-creador`);


      return response.data.esCreador;
    } catch (error: any) {
      console.error('❌ Error verificando si es creador:', error);
      return false; // Si hay error, asumir que no es creador por seguridad
    }
  }

  /**
   * Método legacy - mantener por compatibilidad
   */
  esCreadorDelGrupoLegacy(grupo: GrupoFamiliar, currentUserId: string): boolean {
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