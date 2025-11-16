import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, LoginRequest, RegisterRequest, AuthToken } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la app
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const isValid = await authService.validateToken();
      if (isValid) {
        const currentUser = authService.getCurrentUser();
        const currentToken = authService.getToken();
        
        if (currentUser && currentToken) {
          setUser(currentUser);
          setToken(currentToken);
        } else {
          // Si no hay datos válidos, limpiar todo
          authService.logout();
          setUser(null);
          setToken(null);
        }
      } else {
        // Token inválido o expirado
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Función de login
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      console.log('🔄 AuthContext: Iniciando proceso de login');
      const authData: AuthToken = await authService.login(credentials);
      console.log('✅ AuthContext: Login exitoso, actualizando estado');
      setUser(authData.user);
      setToken(authData.token);
      console.log('✅ AuthContext: Estado actualizado correctamente');
    } catch (error) {
      console.error('❌ AuthContext: Error en login:', error);
      throw error; // Re-lanzar el error para que el componente lo maneje
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro
  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authService.register(userData);
      // Después del registro exitoso, hacer login automático
      await login({
        username: userData.username,
        password: userData.password,
      });
    } catch (error) {
      console.error('Error en registro:', error);
      setIsLoading(false);
      throw error; // Re-lanzar el error para que el componente lo maneje
    }
  };

  // Función de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, []);

  // Verificar periódicamente si el token sigue válido
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        if (!authService.isAuthenticated()) {
          logout();
        }
      }, 60000); // Verificar cada minuto

      return () => clearInterval(interval);
    }
  }, [token]);

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;