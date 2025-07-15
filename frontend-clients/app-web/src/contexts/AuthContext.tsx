import { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
// Importamos tanto la librería principal de axios como nuestra instancia personalizada.
import axios from 'axios';
import api from '../api/axios'; // La instancia personalizada para hacer las llamadas.
import { IFormInputs } from '../pages/types';

// Interfaces para tipar los datos
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

// Creación del contexto con un valor inicial que cumple con el tipo
export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const signup = async (userData: IFormInputs) => {
    try {
      const res = await api.post<User>('/auth/register', userData);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error: any) {
      // Usamos el 'axios' principal para la comprobación de tipo.
      if (axios.isAxiosError(error) && error.response) {
        setErrors(Array.isArray(error.response.data) ? error.response.data : [error.response.data.message]);
      }
    }
  };

  const signin = async (userData: IFormInputs) => {
    try {
      const res = await api.post<User>('/auth/login', userData);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error: any) {
      // Usamos el 'axios' principal para la comprobación de tipo.
      if (axios.isAxiosError(error) && error.response) {
         if (Array.isArray(error.response.data)) {
            return setErrors(error.response.data);
         }
         setErrors([error.response.data.message]);
      }
    }
  };

  const signout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Error durante el cierre de sesión en el servidor:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await api.get<User>('/auth/verify');
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          signout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [signout]);

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
