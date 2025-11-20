import React, { useState } from 'react';
import { ListaCompra, ProductoLista } from '../../types/listaCompra';
import AgregarProductoForm from './AgregarProductoForm.tsx';
import ProductoItem from './ProductoItem.tsx';
import { listaCompraService } from '../../services/listaCompraService';

interface Props {
  lista: ListaCompra;
  onListaActualizada?: () => void;
}

const ListaDetalle: React.FC<Props> = ({ lista, onListaActualizada }) => {
  const [localLista, setLocalLista] = useState<ListaCompra>(lista);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Mantener el estado local sincronizado cuando la prop `lista` cambie
  React.useEffect(() => {
    setLocalLista(lista);
  }, [lista]);

  const handleAgregar = async (producto: Omit<ProductoLista, 'comprado'>) => {
    setLoading(true);
    setMessage(null);
    try {
      const updated = await listaCompraService.agregarProducto(localLista.id, producto);
      setLocalLista(updated);
      setMessage('Producto agregado');
      onListaActualizada && onListaActualizada();
    } catch (err: any) {
      setMessage(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarProducto = async (nombre: string) => {
    const ok = window.confirm(`¿Eliminar el producto "${nombre}" de la lista?`);
    if (!ok) return;
    setLoading(true);
    setMessage(null);
    try {
      const updated = await listaCompraService.eliminarProducto(localLista.id, nombre);
      setLocalLista(updated);
      setMessage('Producto eliminado');
      onListaActualizada && onListaActualizada();
    } catch (err: any) {
      setMessage(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComprado = async (nombre: string, comprado: boolean) => {
    setLoading(true);
    setMessage(null);
    try {
      const updated = await listaCompraService.marcarProductoComprado(localLista.id, nombre, comprado);
      setLocalLista(updated);
      setMessage(comprado ? 'Marcado como comprado' : 'Marcado como no comprado');
      onListaActualizada && onListaActualizada();
    } catch (err: any) {
      setMessage(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{localLista.nombre}</h3>
          <p className="text-sm text-gray-500">{localLista.descripcion}</p>
          <p className="text-xs text-gray-400">Creada: {new Date(localLista.fechaCreacion).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Productos</h4>
        <div className="space-y-2">
          {localLista.productosLista.length === 0 && <div className="text-sm text-gray-500">No hay productos.</div>}
          {localLista.productosLista.map((p) => (
            <ProductoItem
              key={p.nombre}
              producto={p}
              onEliminar={() => handleEliminarProducto(p.nombre)}
              onToggle={(comprado: boolean) => handleToggleComprado(p.nombre, comprado)}
              disabled={loading}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <AgregarProductoForm onAgregar={handleAgregar} disabled={loading} />
      </div>

      {message && <div className="mt-3 text-sm text-gray-700">{message}</div>}
    </div>
  );
};

export default ListaDetalle;
