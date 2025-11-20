import { Users, Calendar, Crown, User, Package, Trash2, UserX } from 'lucide-react';
import { Button } from '../ui/button';
import { GrupoFamiliar } from '../../types/grupoFamiliar';

interface GroupViewProps {
  group: GrupoFamiliar;
  currentUserId: string;
  onDeleteGroup?: () => void;
  onDeleteMember?: (username: string) => void;
}

export const GroupView = ({ group, currentUserId, onDeleteGroup, onDeleteMember }: GroupViewProps) => {
  // Usar la información real del backend sobre permisos
  const isOwner = (group as any).usuarioActualEsCreador || false;
  
  const formatDate = (dateString: string) => {
    try {
      console.log('🔍 Parseando fecha:', dateString, 'Tipo:', typeof dateString);
      
      // Si no hay fecha, mostrar mensaje por defecto
      if (!dateString) {
        console.warn('Fecha vacía o undefined');
        return 'Fecha no disponible';
      }
      
      // Intentar diferentes formatos de parsing
      let date: Date;
      
      // Si es un string, intentar parsearlo
      if (typeof dateString === 'string') {
        // Limpiar el string y convertir
        const cleanDateString = dateString.trim();
        date = new Date(cleanDateString);
        
        // Si falla con new Date(), intentar con parse manual
        if (isNaN(date.getTime())) {
          console.log('🔄 Intentando parsing manual...');
          // Para formato ISO: 2025-11-05T14:34:05.491+00:00
          const isoMatch = cleanDateString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
          if (isoMatch) {
            const [, year, month, day, hour, minute, second] = isoMatch;
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
          }
        }
      } else {
        console.warn('Tipo de fecha no reconocido:', typeof dateString);
        return 'Fecha no disponible';
      }
      
      // Verificar si la fecha final es válida
      if (isNaN(date.getTime())) {
        console.error('❌ Fecha inválida después del parsing:', dateString);
        return 'Fecha no disponible';
      }
      
      console.log('✅ Fecha parseada correctamente:', date);
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('💥 Error parseando fecha:', dateString, error);
      return 'Fecha no disponible';
    }
  };

  const getRoleDisplay = (memberId: string) => {
    if (memberId === group.creador.id) {
      return { text: 'Propietario', icon: Crown, color: 'text-yellow-600' };
    }
    return { text: 'Miembro', icon: User, color: 'text-gray-600' };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{group.nombre}</h1>
            <p className="text-gray-600 mt-1">{group.descripcion}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              Creado el {formatDate(group.fechaCreacion)}
            </div>
            
            {/* Botón de eliminar grupo solo para el propietario */}
            {isOwner && onDeleteGroup && (
              <Button
                onClick={onDeleteGroup}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Grupo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-indigo-600">Miembros</p>
              <p className="text-2xl font-bold text-indigo-900">{(group as any).cantidadMiembros || group.miembros.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">Productos</p>
              <p className="text-2xl font-bold text-orange-900">{(group as any).cantidadProductos || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <Crown className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Tu Rol</p>
              <p className="text-lg font-semibold text-purple-900">
                {isOwner ? 'Propietario' : 'Miembro'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Miembros del Grupo</h2>
          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {((group as any).cantidadMiembros || group.miembros.length)} miembro{((group as any).cantidadMiembros || group.miembros.length) !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-3">
          {group.miembros.map((miembro) => {
            console.log('👤 Renderizando miembro:', miembro);
            console.log('👤 Username:', miembro.username);
            console.log('👤 Email:', miembro.email);
            
            const role = getRoleDisplay(miembro.id);
            const isCurrentUser = miembro.id === currentUserId;
            
            return (
              <div
                key={miembro.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isCurrentUser ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCurrentUser ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    <User className={`w-5 h-5 ${
                      isCurrentUser ? 'text-indigo-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {miembro.username}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-indigo-600 font-medium">(Tú)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{miembro.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <role.icon className={`w-4 h-4 mr-1 ${role.color}`} />
                    <span className={`text-sm font-medium ${role.color}`}>
                      {role.text}
                    </span>
                  </div>
                  
                  {/* Botón eliminar miembro solo para propietario y no para sí mismo */}
                  {isOwner && !isCurrentUser && onDeleteMember && (
                    <Button
                      onClick={() => onDeleteMember(miembro.username)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 px-2 py-1"
                    >
                      <UserX className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {group.miembros.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No hay miembros en este grupo</p>
          </div>
        )}
      </div>

      {/* Group Actions Info */}
      <div className="mt-6 pt-6 border-t">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Crown className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Información sobre permisos
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {isOwner 
                    ? 'Como propietario, puedes agregar miembros, gestionar el grupo y transferir la propiedad.'
                    : 'Como miembro, puedes participar en las actividades del grupo. Solo el propietario puede gestionar miembros.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};