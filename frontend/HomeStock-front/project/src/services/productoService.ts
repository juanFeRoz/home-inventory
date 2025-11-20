import axios from 'axios';

const API_BASE_URL = 'https://home-inventory-58978808961.northamerica-south1.run.app/api/v1/productos';

// Interfaces para productos
export interface Categoria {
  id: string;
  nombre: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  cantidadMinima: number;
  expiracion: string; // Formato ISO 8601
  categoria: Categoria | null;
}

export interface CrearProductoRequest {
  nombre: string;
  descripcion?: string;
  cantidad?: string;
  cantidadMinima?: string;
  expiracion?: string; // Formato dd-MM-yyyy
}

export interface AsignarCategoriaRequest {
  categoria: string;
}

// Utilidades para conversión de fechas
export const formatearFechaParaBackend = (fechaISO: string): string => {
  if (!fechaISO) return '';
  
  try {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    
    return `${dia}-${mes}-${año}`;
  } catch (error) {
    console.error('Error formateando fecha para backend:', error);
    return '';
  }
};

export const parsearFechaDeBackend = (fechaISO: string): string => {
  if (!fechaISO) return '';
  
  try {
    // El backend devuelve formato ISO, lo mantenemos así para inputs de tipo date
    return fechaISO.split('T')[0]; // Obtener solo la parte de fecha YYYY-MM-DD
  } catch (error) {
    console.error('Error parseando fecha del backend:', error);
    return '';
  }
};

class ProductoService {
  
  /**
   * ENDPOINT 1: Crear producto en un lugar específico
   */
  async crearProducto(lugarId: string, productoData: CrearProductoRequest): Promise<Producto> {
    try {
      console.log('🔄 Creando producto en lugar:', lugarId, productoData);
      
      // Convertir fecha si existe
      const dataParaEnviar = {
        ...productoData,
        expiracion: productoData.expiracion ? formatearFechaParaBackend(productoData.expiracion) : undefined
      };
      
      const response = await axios.post<Producto>(`${API_BASE_URL}/lugares/${lugarId}`, dataParaEnviar);
      
      console.log('✅ Producto creado exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creando producto:', error);
      const errorMessage = error.response?.data || 'Error al crear el producto';
      throw new Error(errorMessage);
    }
  }

  /**
   * ENDPOINT 2: Obtener todos los productos
   */
  async obtenerTodosLosProductos(): Promise<Producto[]> {
    try {
      console.log('🔄 Obteniendo todos los productos');
      
      const response = await axios.get<Producto[]>(API_BASE_URL);
      
      console.log('✅ Productos obtenidos:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo productos:', error);
      const errorMessage = error.response?.data || 'Error al obtener los productos';
      throw new Error(errorMessage);
    }
  }

  /**
   * ENDPOINT 3: Obtener producto por nombre
   */
  async obtenerProductoPorNombre(nombre: string): Promise<Producto> {
    try {
      console.log('🔄 Obteniendo producto por nombre:', nombre);
      
      const response = await axios.get<Producto>(`${API_BASE_URL}/${encodeURIComponent(nombre)}`);
      
      console.log('✅ Producto obtenido:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo producto por nombre:', error);
      const errorMessage = error.response?.data || 'Error al obtener el producto';
      throw new Error(errorMessage);
    }
  }

  /**
   * ENDPOINT 4: Reducir cantidad del producto (eliminar 1 unidad)
   */
  async reducirCantidadProducto(productoId: string): Promise<string> {
    try {
      console.log('🔄 Reduciendo cantidad del producto:', productoId);
      
      const response = await axios.delete(`${API_BASE_URL}/${productoId}`);
      
      const mensaje = response.data || 'Producto actualizado correctamente';
      console.log('✅ Cantidad reducida:', mensaje);
      return mensaje;
    } catch (error: any) {
      console.error('❌ Error reduciendo cantidad:', error);
      const errorMessage = error.response?.data || 'Error al reducir la cantidad del producto';
      throw new Error(errorMessage);
    }
  }

  /**
   * ENDPOINT 5: Eliminar producto completamente
   */
  async eliminarProductoCompleto(productoId: string): Promise<string> {
    try {
      console.log('🔄 Eliminando producto completamente:', productoId);
      
      const response = await axios.delete(`${API_BASE_URL}/${productoId}/completo`);
      
      const mensaje = response.data || 'Producto eliminado completamente';
      console.log('✅ Producto eliminado:', mensaje);
      return mensaje;
    } catch (error: any) {
      console.error('❌ Error eliminando producto:', error);
      const errorMessage = error.response?.data || 'Error al eliminar el producto';
      throw new Error(errorMessage);
    }
  }

  /**
   * ENDPOINT 6: Asignar categoría a producto
   */
  async asignarCategoria(productoId: string, categoria: string): Promise<Producto> {
    try {
      console.log('🔄 Asignando categoría al producto:', productoId, categoria);
      
      const dataParaEnviar: AsignarCategoriaRequest = { categoria };
      
      const response = await axios.put<Producto>(`${API_BASE_URL}/${productoId}/categoria`, dataParaEnviar);
      
      console.log('✅ Categoría asignada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error asignando categoría:', error);
      const errorMessage = error.response?.data || 'Error al asignar la categoría';
      throw new Error(errorMessage);
    }
  }
}

export const productoService = new ProductoService();