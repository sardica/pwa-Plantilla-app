// frontend-clients/app-web/src/contexts/AuthContext.tsx

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import api from '../api/axios';
import { IFormInputs } from '../pages/types';

// Interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  signup: (user: IFormInputs) => Promise<void>;
  signin: (user: IFormInputs) => Promise<void>;
  signout: () => void;
  user: User | null;
  isAuthenticated: boolean;
  errors: string[];
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// CORRECCIÓN: Se crea y exporta el contexto. El hook 'useAuth' se moverá a su propio archivo.
export const AuthContext = createContext<AuthContextType | null>(null);

// --- Interceptor de Axios ---
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const signin = async (userData: IFormInputs) => {
    try {
      const res = await api.post<{ accessToken: string }>('/auth/login', userData);
      localStorage.setItem('token', res.data.accessToken);
      const profileRes = await api.get<User>('/auth/profile');
      setUser(profileRes.data);
      setIsAuthenticated(true);
      setErrors([]);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
         if (Array.isArray(error.response.data)) {
            return setErrors(error.response.data);
         }
         setErrors([error.response.data.message || 'Error al iniciar sesión']);
      }
    }
  };

  const signup = async (userData: IFormInputs) => {
    try {
      await api.post('/auth/register', userData);
      await signin(userData);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors(Array.isArray(error.response.data) ? error.response.data : [error.response.data.message || 'Error al registrarse']);
      }
    }
  };

  const signout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Error durante el cierre de sesión en el servidor:", error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      try {
        const res = await api.get<User>('/auth/verify');
        if (!res.data) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setUser(res.data);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{
      signup,
      signin,
      signout,
      user,
      isAuthenticated,
      errors,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
