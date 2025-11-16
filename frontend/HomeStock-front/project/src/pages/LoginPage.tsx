import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Loader } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Intentando login con:', { username: data.username });
      await login(data);
      console.log('✅ Login exitoso, redirigiendo...');
      navigate('/', { replace: true }); // Redirigir al dashboard después del login exitoso
    } catch (err: any) {
      console.error('❌ Error en login:', err);
      console.error('❌ Respuesta del servidor:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Accede a tu cuenta para gestionar tu inventario"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fadeIn">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-400 rounded-full mr-3"></div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Campo de usuario */}
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nombre de Usuario
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="username"
              type="text"
              {...register('username', {
                required: 'El nombre de usuario es requerido',
              })}
              className={`pl-10 transition-all duration-200 ${
                errors.username 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Ingresa tu nombre de usuario"
              disabled={isLoading}
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-600 animate-fadeIn">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Campo de contraseña */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'La contraseña es requerida',
              })}
              className={`pl-10 pr-10 transition-all duration-200 ${
                errors.password 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 animate-fadeIn">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Botón de submit */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </div>

        {/* Link a registro */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Información de prueba para desarrollo */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Ejemplo de usuario:
          </h4>
          <p className="text-xs text-gray-600">
            Usuario: <code className="bg-gray-200 px-1 rounded">daniel</code>
          </p>
          <p className="text-xs text-gray-600">
            Contraseña: <code className="bg-gray-200 px-1 rounded">1234</code>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};