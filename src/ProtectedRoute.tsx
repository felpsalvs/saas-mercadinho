import { Navigate } from 'react-router-dom';
import { useUserStore } from './stores';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // opcional, para rotas que precisam estar deslogado (como login)
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, isLoading } = useUserStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    // Usuário não está autenticado mas precisa estar
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && user) {
    // Usuário está autenticado mas não deveria estar (ex: página de login)
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}