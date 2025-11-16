import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { grupoFamiliarService } from '../../services/grupoFamiliarService';
import { CreateGroupModalProps } from '../../types/grupoFamiliar';

interface CreateGroupForm {
  nombre: string;
  descripcion: string;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGroupForm>();

  const onSubmit = async (data: CreateGroupForm) => {
    setIsLoading(true);
    setError(null);

    try {
      await grupoFamiliarService.crearGrupo(data);
      reset();
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear el grupo familiar';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Crear Grupo Familiar</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-white/80 hover:text-white transition-colors p-1 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Nombre del grupo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Grupo *
            </label>
            <Input
              {...register('nombre', {
                required: 'El nombre del grupo es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
                maxLength: {
                  value: 50,
                  message: 'El nombre no puede tener más de 50 caracteres',
                },
              })}
              placeholder="Ej: Familia González"
              className={`w-full ${
                errors.nombre 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              {...register('descripcion', {
                maxLength: {
                  value: 200,
                  message: 'La descripción no puede tener más de 200 caracteres',
                },
              })}
              placeholder="Describe brevemente tu grupo familiar..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors resize-none ${
                errors.descripcion 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              ℹ️ Información importante:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Serás el administrador del grupo</li>
              <li>• Podrás agregar y eliminar miembros</li>
              <li>• Solo puedes pertenecer a un grupo</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Users size={18} />
                  Crear Grupo
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
