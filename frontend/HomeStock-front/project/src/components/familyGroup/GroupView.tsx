import { Users, Calendar, Crown, User, Clock } from 'lucide-react';
import { GrupoFamiliar } from '../../types/grupoFamiliar';

interface GroupViewProps {
  group: GrupoFamiliar;
  currentUserId: string;
}

export const GroupView = ({ group, currentUserId }: GroupViewProps) => {
  const isOwner = group.creador.id === currentUserId;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            Creado el {formatDate(group.fechaCreacion)}
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
              <p className="text-2xl font-bold text-indigo-900">{group.miembros.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Estado</p>
              <p className="text-lg font-semibold text-green-900">Activo</p>
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
            {group.miembros.length} miembro{group.miembros.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-3">
          {group.miembros.map((miembro) => {
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

                <div className="flex items-center">
                  <role.icon className={`w-4 h-4 mr-1 ${role.color}`} />
                  <span className={`text-sm font-medium ${role.color}`}>
                    {role.text}
                  </span>
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