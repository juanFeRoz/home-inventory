// Tipos para Lugares
export interface Lugar {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
  grupoFamiliarId: string;
  productos: Producto[];
  creadoPor: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  cantidadMinima: number;
  expiracion: string; // Formato ISO 8601
  categoria: {
    id: string;
    nombre: string;
  } | null;
  lugarId?: string;
  creadoPor?: string;
  fechaCreacion?: string;
  fechaVencimiento?: string; // Para retrocompatibilidad
}

// DTOs para requests
export interface CrearLugarRequest {
  nombre: string;
  descripcion: string;
  grupoFamiliarId: string;
  userId: string;
}

// Estados del componente
export interface LugarState {
  lugares: Lugar[];
  isLoading: boolean;
  error: string | null;
}

export interface LugarDetalleState {
  lugar: Lugar | null;
  productos: Producto[];
  isLoading: boolean;
  error: string | null;
}