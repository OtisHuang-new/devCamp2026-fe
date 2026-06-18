import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext_v2 } from '../shared/context/hooks/useAuthContext_v2';

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext_v2();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-white text-[#1E3A8A] font-bold">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/roadmap" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
