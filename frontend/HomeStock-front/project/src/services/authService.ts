import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/user';

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

      // Obtener información real del usuario desde el backend
      let user: User;
      try {
        console.log('🔄 Intentando obtener información real del usuario...');
        user = await this.getCurrentUserInfo(token);
        console.log('✅ Información del usuario obtenida desde backend/JWT:', user);
      } catch (error) {
        console.warn('⚠️ No se pudo obtener info del usuario, usando estrategia de fallback:', error);
        
        // Estrategia de fallback: usar ID consistente basado en username
        const consistentId = this.generateConsistentUserId(credentials.username);
        console.log('🔄 Generando ID consistente para', credentials.username + ':', consistentId);
        
        user = {
          id: consistentId,
          username: credentials.username,
          email: '',
        };
      }

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

  // Generar ID consistente basado en username
  private generateConsistentUserId(username: string): string {
    // Crear un hash simple basado en el username para tener IDs consistentes
    let hash = 0;
    if (username.length === 0) return 'user-unknown';
    
    for (let i = 0; i < username.length; i++) {
      const char = username.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32bit integer
    }
    
    // Convertir a positivo y agregar prefijo
    const positiveHash = Math.abs(hash);
    return `user-${username}-${positiveHash}`;
  }

  // Obtener información del usuario actual
  async getCurrentUserInfo(token?: string): Promise<User> {
    try {
      const authToken = token || this.getToken();
      if (!authToken) {
        throw new Error('No hay token de autenticación');
      }

      // Intentar decodificar el JWT para obtener la información del usuario
      try {
        const tokenParts = authToken.split('.');
        if (tokenParts.length === 3) {
          // Es un JWT válido, intentar decodificar
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('🔍 Payload del JWT completo:', payload);
          
          // Listar todos los campos disponibles
          console.log('🔍 Campos disponibles en el JWT:', Object.keys(payload));
          
          // Buscar el ID del usuario en diferentes campos posibles
          const userId = payload.sub || payload.userId || payload.id || payload.user_id;
          const username = payload.username || payload.name || payload.user_name;
          const email = payload.email || payload.user_email;
          
          if (userId) {
            return {
              id: userId,
              username: username || 'Usuario',
              email: email || '',
            };
          }
        }
      } catch (jwtError) {
        console.warn('⚠️ No se pudo decodificar el JWT, intentando endpoint /me');
      }

      // Si no se pudo decodificar el JWT, intentar diferentes endpoints del backend
      const originalToken = localStorage.getItem('authToken');
      if (token) {
        localStorage.setItem('authToken', token);
      }

      console.log('🔄 Intentando endpoints para obtener info del usuario...');
      
      // Intentar varios endpoints posibles
      const possibleEndpoints = [
        `${API_BASE_URL}/me`,
        `${API_BASE_URL}/profile`,
        `${API_BASE_URL}/current`,
        `https://home-inventory-58978808961.northamerica-south1.run.app/api/v1/user/me`,
        `https://home-inventory-58978808961.northamerica-south1.run.app/api/v1/auth/me`
      ];

      let userData = null;
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`🔄 Probando endpoint: ${endpoint}`);
          const response = await axios.get<User>(endpoint);
          console.log(`✅ Endpoint exitoso: ${endpoint}`, response.data);
          userData = response.data;
          break;
        } catch (endpointError: any) {
          console.log(`❌ Falló endpoint ${endpoint}:`, endpointError.response?.status || endpointError.message);
        }
      }
      
      if (token && originalToken) {
        localStorage.setItem('authToken', originalToken);
      }

      if (!userData) {
        throw new Error('No se pudo obtener información del usuario desde ningún endpoint');
      }

      return userData;
    } catch (error: any) {
      console.error('Error obteniendo información del usuario:', error);
      throw new Error('Error al obtener información del usuario');
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

  // Cache para información de usuarios
  private userInfoCache = new Map<string, { username: string; email: string; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  // Obtener información de un usuario por ID
  async getUserInfo(userId: string): Promise<{ username: string; email: string }> {
    try {
      // Verificar cache primero
      const cached = this.userInfoCache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log('📋 Info de usuario desde cache:', userId, cached);
        return { username: cached.username, email: cached.email };
      }

      console.log('🔄 Obteniendo info del usuario desde backend:', userId);
      
      const response = await axios.get<{ username: string; email: string }>(
        `${API_BASE_URL}/info/${userId}`
      );

      const userInfo = response.data;
      
      // Guardar en cache
      this.userInfoCache.set(userId, {
        username: userInfo.username,
        email: userInfo.email,
        timestamp: Date.now()
      });

      console.log('✅ Info de usuario obtenida:', userId, userInfo);
      return userInfo;
    } catch (error: any) {
      console.error('❌ Error obteniendo info del usuario:', userId, error);
      
      // Intentar extraer username del ID si tiene formato conocido
      if (userId.includes('-') && userId.startsWith('user-')) {
        const parts = userId.split('-');
        if (parts.length >= 2) {
          const extractedUsername = parts[1];
          return { username: extractedUsername, email: '' };
        }
      }
      
      // Fallback: mostrar ID truncado
      return { username: userId.substring(0, 8) + '...', email: '' };
    }
  }

  // Verificar y renovar token si es necesario
  async validateToken(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      // Verificar token con el backend y actualizar información del usuario
      const userInfo = await this.getCurrentUserInfo();
      
      // Actualizar localStorage con la información correcta
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      console.log('✅ Token validado y información de usuario actualizada:', userInfo);
      return true;
    } catch (error) {
      console.error('❌ Error validando token:', error);
      // Si falla la validación, el token podría ser inválido
      this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();