import axios from 'axios';

const API_BASE_URL = 'https://home-inventory-58978808961.northamerica-south1.run.app/api/v1/user';

// Tipos de datos
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthToken {
  token: string;
  user: User;
}

// Configurar interceptor para agregar token a las peticiones
const setupAxiosInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token && config.headers) {
        console.log('🔐 Agregando token al header:', token.substring(0, 20) + '...');
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar errores de autenticación
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn('❌ Token expirado o inválido, limpiando autenticación');
        // Token expirado o inválido
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

class AuthService {
  constructor() {
    setupAxiosInterceptor();
  }

  // Iniciar sesión
  async login(credentials: LoginRequest): Promise<AuthToken> {
    try {
      console.log('🔄 Enviando petición de login a:', `${API_BASE_URL}/signin`);
      console.log('🔄 Credenciales:', { username: credentials.username });
      
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/signin`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Respuesta del backend:', response.data);
      const { token, expiresIn } = response.data;

      // Validar que el token existe
      if (!token || typeof token !== 'string') {
        throw new Error('Token inválido recibido del servidor');
      }

      // Verificar si es un JWT válido o un token personalizado
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        console.log('✅ Token JWT válido recibido');
      } else {
        console.log('✅ Token personalizado recibido del backend:', token.substring(0, 20) + '...');
      }

      // Decodificar el token para obtener información del usuario (simulado)
      // En producción, podrías decodificar el JWT o hacer una petición adicional
      const user: User = {
        id: 'user-' + Date.now(),
        username: credentials.username,
        email: '', // Se podría obtener del backend
      };

      const authToken: AuthToken = {
        token,
        user,
      };

      // Almacenar en localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configurar expiración del token
      const expirationTime = Date.now() + (expiresIn || 3600000); // Default 1 hora si no viene expiresIn
      localStorage.setItem('tokenExpiration', expirationTime.toString());

      console.log('✅ Token almacenado correctamente:', token.substring(0, 20) + '...');
      return authToken;
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      console.error('❌ Respuesta de error:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  // Registrar usuario
  async register(userData: RegisterRequest): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('password', userData.password);

      const response = await axios.post<User>(`${API_BASE_URL}/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const expiration = localStorage.getItem('tokenExpiration');

    if (!token) {
      return false;
    }

    // Si hay expiración configurada, verificarla
    if (expiration) {
      const now = Date.now();
      const expirationTime = parseInt(expiration);

      if (now >= expirationTime) {
        console.warn('⚠️ Token expirado, limpiando...');
        this.logout();
        return false;
      }
    }

    return true;
  }

  // Obtener usuario actual del localStorage
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Verificar y renovar token si es necesario
  async validateToken(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Aquí podrías agregar lógica para verificar el token con el backend
    // Por ahora, confiamos en la verificación local
    return true;
  }
}

export const authService = new AuthService();