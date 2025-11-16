import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { lugarService } from '../../services/lugarService';
import { grupoFamiliarService } from '../../services/grupoFamiliarService';
import { LugarState } from '../../types/lugar';
import { LugarLista } from './LugarLista.tsx';
import { CrearLugarModal } from './CrearLugarModal.tsx';
import { LugarDetalle } from './LugarDetalle.tsx';
import { ConfirmModal } from '../familyGroup/ConfirmModal';
import { Button } from '../ui/button';
import { MapPin, Plus, RefreshCw, AlertCircle, Loader } from 'lucide-react';

type ViewMode = 'lista' | 'detalle' | 'crear';

export const LugarManagement: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('lista');
  const [selectedLugarId, setSelectedLugarId] = useState<string | null>(null);
  const [lugarToDelete, setLugarToDelete] = useState<string | null>(null);
  const [grupoFamiliarId, setGrupoFamiliarId] = useState<string | null>(null);
  
  const [state, setState] = useState<LugarState>({
    lugares: [],
    isLoading: true,
    error: null,
  });

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Cargar grupo familiar del usuario y sus lugares
  useEffect(() => {
    loadUserGroupAndPlaces();
  }, []);

  const loadUserGroupAndPlaces = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Obtener el grupo familiar del usuario
      const grupoId = await grupoFamiliarService.obtenerMiGrupo();
      setGrupoFamiliarId(grupoId);

      // Obtener los lugares del grupo
      const lugares = await lugarService.obtenerLugaresPorGrupo(grupoId);

      setState({
        lugares,
        isLoading: false,
        error: null,
      });

      console.log('✅ Lugares cargados exitosamente');
    } catch (error: any) {
      console.error('❌ Error cargando lugares:', error);
      
      if (error.message === 'NO_GROUP') {
        setState({
          lugares: [],
          isLoading: false,
          error: 'No perteneces a ningún grupo familiar. Debes unirte a un grupo para gestionar lugares.',
        });
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Error al cargar los lugares',
        }));
      }
    }
  };

  const handleCreateLugar = async () => {
    console.log('🎉 Lugar creado exitosamente! Recargando lista...');
    console.log('🔄 Usuario actual para permisos:', user?.id);
    setShowCreateModal(false);
    await loadUserGroupAndPlaces();
    // toast.success('Lugar creado exitosamente!');
  };

  const handleViewLugar = (lugarId: string) => {
    setSelectedLugarId(lugarId);
    setCurrentView('detalle');
  };

  const handleDeleteLugar = async (lugarId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await lugarService.eliminarLugar(lugarId);
      await loadUserGroupAndPlaces();
      setLugarToDelete(null);
      // toast.success('Lugar eliminado exitosamente!');
    } catch (error: any) {
      console.error('❌ Error eliminando lugar:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      // toast.error(error.message || 'Error al eliminar el lugar');
    }
  };

  const handleBackToList = () => {
    setCurrentView('lista');
    setSelectedLugarId(null);
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando lugares...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-red-800">Error</h3>
        </div>
        <p className="text-red-700 mb-4">{state.error}</p>
        <Button
          onClick={loadUserGroupAndPlaces}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lugares</h1>
              <p className="text-gray-600">Gestiona los lugares de tu hogar</p>
            </div>
          </div>

          {currentView === 'lista' && grupoFamiliarId && (
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Lugar
              </Button>
              
              <Button
                onClick={loadUserGroupAndPlaces}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      {currentView === 'lista' && (
        <LugarLista
          lugares={state.lugares}
          currentUserId={user?.id || ''}
          onViewLugar={handleViewLugar}
          onDeleteLugar={(lugarId: string) => setLugarToDelete(lugarId)}
        />
      )}

      {currentView === 'detalle' && selectedLugarId && (
        <LugarDetalle
          lugarId={selectedLugarId}
          currentUserId={user?.id || ''}
          onBack={handleBackToList}
          onDeleteLugar={(lugarId: string) => setLugarToDelete(lugarId)}
        />
      )}

      {/* Modales */}
      {grupoFamiliarId && (
        <CrearLugarModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateLugar}
          grupoFamiliarId={grupoFamiliarId}
          userId={user?.id || ''}
        />
      )}

      <ConfirmModal
        isOpen={!!lugarToDelete}
        onClose={() => setLugarToDelete(null)}
        onConfirm={() => lugarToDelete && handleDeleteLugar(lugarToDelete)}
        title="Eliminar Lugar"
        message="¿Estás seguro de que quieres eliminar este lugar? Esta acción no se puede deshacer y se eliminarán todos los productos asociados."
        confirmText="Eliminar Lugar"
        variant="danger"
      />
    </div>
  );
};