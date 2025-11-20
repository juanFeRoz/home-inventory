export interface ProductoLista {
  nombre: string;
  cantidad?: string;
  unidad?: string;
  comprado: boolean;
}

export interface ListaCompra {
  id: string;
  nombre: string;
  descripcion?: string | null;
  fechaCreacion: string;
  grupoFamiliarId: string;
  productosLista: ProductoLista[];
}
