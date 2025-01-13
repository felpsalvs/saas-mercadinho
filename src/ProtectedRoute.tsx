import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // opcional, para rotas que precisam estar deslogado (como login)
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (requireAuth && !user) {
    // Usuário não está autenticado mas precisa estar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // Usuário está autenticado mas não deveria estar (ex: página de login)
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}