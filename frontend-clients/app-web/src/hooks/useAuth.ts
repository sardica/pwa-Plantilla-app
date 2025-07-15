import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * Proporciona una forma segura de consumir el contexto, asegurando
 * que se utiliza dentro de un AuthProvider.
 * @returns El valor del contexto de autenticación.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Si el contexto es nulo, significa que el hook se está usando
  // fuera de un AuthProvider, lo cual es un error.
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }

  return context;
};
