import { useAuth } from './hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <h1>Cargando...</h1>;

  if (!loading && !isAuthenticated) return <Navigate to='/login' replace />;

  return <Outlet />;
}

export default ProtectedRoute;
