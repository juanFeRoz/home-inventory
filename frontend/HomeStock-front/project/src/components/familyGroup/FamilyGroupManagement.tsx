import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { grupoFamiliarService } from '../../services/grupoFamiliarService';
import { GrupoFamiliarState } from '../../types/grupoFamiliar';
import { CreateGroupModal } from './CreateGroupModal';
import { AddMemberModal } from './AddMemberModal';
import { GroupView } from './GroupView';
import { ConfirmModal } from './ConfirmModal';
import { Button } from '../ui/button';
import { Users, Plus, AlertCircle, Loader, RefreshCw } from 'lucide-react';
// import { toast } from 'react-toastify';

export const FamilyGroupManagement: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<GrupoFamiliarState>({
    grupo: null,
    isLoading: true,
    error: null,
    hasGroup: false,
  });

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  // Cargar grupo al montar componente
  useEffect(() => {
    loadUserGroup();
  }, []);

  const loadUserGroup = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Obtener el ID del grupo del usuario
      const grupoId = await grupoFamiliarService.obtenerMiGrupo();

      // Como no tenemos endpoint para obtener detalles, creamos un grupo temporal
      const grupoTemporal = {
        id: grupoId,
        nombre: 'Mi Grupo Familiar',
        descripcion: 'Grupo familiar principal',
        creador: {
          id: user?.id || '',
          username: user?.username || '',
          email: user?.email || ''
        },
        miembros: [
          {
            id: user?.id || '',
            username: user?.username || '',
            email: user?.email || '',
            fechaUnion: new Date().toISOString(),
            esCreador: true
          }
        ],
        fechaCreacion: new Date().toISOString()
      };

      setState({
        grupo: grupoTemporal,
        isLoading: false,
        error: null,
        hasGroup: true,
      });

      console.log('✅ Grupo cargado exitosamente');
    } catch (error: any) {
      console.error('❌ Error cargando grupo:', error);
      
      if (error.message === 'NO_GROUP') {
        // Usuario no tiene grupo
        setState({
          grupo: null,
          isLoading: false,
          error: null,
          hasGroup: false,
        });
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Error al cargar el grupo',
        }));
      }
    }
  };

  const handleCreateGroup = async () => {
    setShowCreateModal(false);
    await loadUserGroup();
    // toast.success('Grupo familiar creado exitosamente!');
  };

  const handleAddMember = async () => {
    setShowAddMemberModal(false);
    await loadUserGroup();
    // toast.success('Miembro agregado exitosamente!');
  };

  const handleDeleteMember = async (username: string) => {
    try {
      if (!state.grupo) return;

      setState(prev => ({ ...prev, isLoading: true }));
      await grupoFamiliarService.eliminarMiembro(state.grupo.id, username);
      await loadUserGroup();
      setMemberToDelete(null);
      // toast.success('Miembro eliminado exitosamente!');
    } catch (error: any) {
      console.error('❌ Error eliminando miembro:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      // toast.error(error.message || 'Error al eliminar el miembro');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (!state.grupo) return;

      setState(prev => ({ ...prev, isLoading: true }));
      await grupoFamiliarService.eliminarGrupo(state.grupo.id);
      
      setState({
        grupo: null,
        isLoading: false,
        error: null,
        hasGroup: false,
      });
      
      setShowDeleteGroupModal(false);
      // toast.success('Grupo eliminado exitosamente!');
    } catch (error: any) {
      console.error('❌ Error eliminando grupo:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      // toast.error(error.message || 'Error al eliminar el grupo');
    }
  };



  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando información del grupo...</p>
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
          onClick={loadUserGroup}
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
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grupos Familiares</h1>
              <p className="text-gray-600">Gestiona tu grupo familiar y sus miembros</p>
            </div>
          </div>

          {state.hasGroup && state.grupo && (
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddMemberModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Miembro
              </Button>
              
              <Button
                onClick={loadUserGroup}
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
      {!state.hasGroup ? (
        // Usuario no tiene grupo - Mostrar opción para crear
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            No perteneces a ningún grupo familiar
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Crea tu propio grupo familiar para gestionar el inventario del hogar junto con tu familia.
          </p>
          
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Crear Grupo Familiar
          </Button>
        </div>
      ) : (
        // Usuario tiene grupo - Mostrar información del grupo
        state.grupo && (
          <GroupView
            group={state.grupo}
            currentUserId={user?.id || ''}
          />
        )
      )}

      {/* Modales */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateGroup}
      />

      {state.grupo && (
        <AddMemberModal
          isOpen={showAddMemberModal}
          onClose={() => setShowAddMemberModal(false)}
          groupId={state.grupo.id}
          onMemberAdded={handleAddMember}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteGroupModal}
        onClose={() => setShowDeleteGroupModal(false)}
        onConfirm={handleDeleteGroup}
        title="Eliminar Grupo Familiar"
        message="¿Estás seguro de que quieres eliminar este grupo familiar? Esta acción no se puede deshacer y todos los miembros perderán acceso al inventario compartido."
        confirmText="Eliminar Grupo"
        variant="danger"
      />

      <ConfirmModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() => memberToDelete && handleDeleteMember(memberToDelete)}
        title="Eliminar Miembro"
        message={`¿Estás seguro de que quieres eliminar a "${memberToDelete}" del grupo familiar?`}
        confirmText="Eliminar Miembro"
        variant="danger"
      />
    </div>
  );
};