// Tipos para Grupos Familiares
export interface GrupoFamiliar {
  id: string;
  nombre: string;
  descripcion: string;
  creador: {
    id: string;
    username: string;
    email: string;
  };
  miembros: MiembroGrupo[];
  fechaCreacion: string;
}

export interface MiembroGrupo {
  id: string;
  username: string;
  email: string;
  fechaUnion: string;
  esCreador: boolean;
}

// DTOs para requests
export interface CrearGrupoRequest {
  nombre: string;
  descripcion: string;
}

export interface AgregarMiembroRequest {
  username: string;
}

// Respuestas de la API
export interface MiGrupoResponse {
  grupoId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Estados de la aplicación
export interface GrupoFamiliarState {
  grupo: GrupoFamiliar | null;
  isLoading: boolean;
  error: string | null;
  hasGroup: boolean;
}

// Props para componentes
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface CreateGroupModalProps extends ModalProps {}

export interface AddMemberModalProps extends ModalProps {
  grupoId: string;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}