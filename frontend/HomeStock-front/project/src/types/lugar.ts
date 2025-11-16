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
  descripcion?: string;
  cantidad: number;
  fechaVencimiento?: string;
  categoria?: string;
  lugarId: string;
  creadoPor: string;
  fechaCreacion: string;
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