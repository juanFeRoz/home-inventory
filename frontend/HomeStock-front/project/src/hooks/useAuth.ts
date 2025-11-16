import { useState, useEffect, useCallback } from 'react';

// Tipos locales
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthToken {
  token: string;
  user: User;
}

// Usuario simulado para desarrollo
const MOCK_USER: AuthToken = {
  token: 'mock-dev-token-123',
  user: {
    id: 'dev-user-1',
    username: 'usuario_dev',
    email: 'dev@example.com'
  }
};

export const useAuthOld = () => {
  const [user, setUser] = useState<AuthToken['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } else {
        // En modo desarrollo, simular usuario logueado si no hay datos
        console.log('🚀 Modo desarrollo: Simulando usuario logueado');
        setToken(MOCK_USER.token);
        setUser(MOCK_USER.user);
        // Guardar en localStorage para consistencia
        localStorage.setItem('authToken', MOCK_USER.token);
        localStorage.setItem('user', JSON.stringify(MOCK_USER.user));
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      // Limpiar datos corruptos y usar usuario simulado
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setToken(MOCK_USER.token);
      setUser(MOCK_USER.user);
      localStorage.setItem('authToken', MOCK_USER.token);
      localStorage.setItem('user', JSON.stringify(MOCK_USER.user));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((authData: AuthToken) => {
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
};
