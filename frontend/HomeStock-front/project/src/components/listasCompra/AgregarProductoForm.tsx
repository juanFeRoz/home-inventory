import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Props {
  onAgregar: (producto: { nombre: string; cantidad?: string; unidad?: string }) => Promise<void> | void;
  disabled?: boolean;
}

const AgregarProductoForm: React.FC<Props> = ({ onAgregar, disabled = false }) => {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nombre.trim()) return setError('El nombre del producto es requerido');
    try {
      await onAgregar({ nombre: nombre.trim(), cantidad: cantidad.trim() || undefined, unidad: unidad.trim() || undefined });
      setNombre('');
      setCantidad('');
      setUnidad('');
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
        <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del producto" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
        <Input value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
          <Input value={unidad} onChange={(e) => setUnidad(e.target.value)} placeholder="Unidad" />
        </div>
        <div>
          <Button type="submit" disabled={disabled} className="whitespace-nowrap">Agregar</Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 md:col-span-4">{error}</div>}
    </form>
  );
};

export default AgregarProductoForm;
