import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext_v2 } from '../shared/context/hooks/useAuthContext_v2';
import { LoadingSpinner } from '@/shared/components/Loading/LoadingSpinner';

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext_v2();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-white h-">
        <LoadingSpinner text="" iconSize="w-14 h-14"></LoadingSpinner>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/roadmap" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
