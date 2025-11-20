export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface CrearCategoriaRequest {
  nombre: string;
  descripcion?: string;
}

export interface CategoriaFormData {
  nombre: string;
  descripcion: string;
}