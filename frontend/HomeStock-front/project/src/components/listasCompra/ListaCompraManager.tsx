import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useListasCompra } from '../../hooks/useListasCompra';
import { grupoFamiliarService } from '../../services/grupoFamiliarService';
import ListaDetalle from './ListaDetalle.tsx';
import { ListaCompra } from '../../types/listaCompra';
import { Trash2 } from 'lucide-react';

const ListaCompraManager: React.FC = () => {
  const [grupoId, setGrupoId] = useState<string | null>(null);
  const { listas, selectedLista, loading, error, fetchListas, selectLista, crearLista, eliminarLista } = useListasCompra();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const id = await grupoFamiliarService.obtenerMiGrupo();
        setGrupoId(id);
        await fetchListas(id);
      } catch (err: any) {
        console.error('No se pudo obtener el grupo:', err);
        setActionMessage(typeof err === 'string' ? err : err?.message || 'Error obteniendo grupo');
      }
    };
    load();
  }, [fetchListas]);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return setActionMessage('El nombre de la lista es requerido');
    try {
      await crearLista(nombre.trim(), descripcion.trim() || undefined);
      setNombre('');
      setDescripcion('');
      setActionMessage('Lista creada correctamente');
      if (grupoId) await fetchListas(grupoId);
    } catch (err: any) {
      setActionMessage(err?.message || String(err));
    }
  };

  const handleEliminarLista = async (lista: ListaCompra) => {
    const ok = window.confirm(`¿Eliminar la lista "${lista.nombre}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    try {
      await eliminarLista(lista.id);
      setActionMessage('Lista eliminada');
      if (grupoId) await fetchListas(grupoId);
    } catch (err: any) {
      setActionMessage(err?.message || String(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Listas de Compra</h2>

        <form onSubmit={handleCrear} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de la lista" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción (opcional)" />
          </div>
          <div className="md:col-span-1">
            <Button type="submit" className="w-full" disabled={loading}>
              Crear lista
            </Button>
          </div>
        </form>

        {actionMessage && <div className="mt-3 text-sm text-gray-700">{actionMessage}</div>}
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-medium mb-3">Tus listas</h3>
            {loading && <div className="text-sm text-gray-500"></div>}
            {!loading && listas.length === 0 && <div className="text-sm text-gray-500">No hay listas aún.</div>}
            <ul className="space-y-2">
              {listas.map((l) => (
                <li key={l.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                      <button type="button" className="text-left flex-1" onClick={() => selectLista(l.id)}>
                    <div className="font-medium">{l.nombre}</div>
                    <div className="text-sm text-gray-500">{l.descripcion}</div>
                      </button>
                  <div className="flex items-center gap-2 ml-3">
                        <Button type="button" variant="outline" size="sm" onClick={() => selectLista(l.id)}>Ver</Button>
                        <Button
                          type="button"
                          onClick={() => handleEliminarLista(l)}
                          variant="outline"
                          size="lg"
                          className="p-3 h-10 w-10 flex items-center justify-center text-red-600 border-red-300 hover:bg-red-50"
                          title={`Eliminar lista ${l.nombre}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            {selectedLista ? (
              <ListaDetalle
                lista={selectedLista}
                onListaActualizada={async () => { if (grupoId) await fetchListas(grupoId); }}
              />
            ) : (
              <div className="text-sm text-gray-500">Selecciona una lista para ver y gestionar productos.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaCompraManager;
