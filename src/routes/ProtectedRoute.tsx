import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext_v2 } from '../shared/context/hooks/useAuthContext_v2';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext_v2();

  const hasCompletedSurvey = !!localStorage.getItem('survey_job');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-white text-[#1E3A8A] font-bold">
        Loading...
      </div>
    );
  }

  if (isAuthenticated || hasCompletedSurvey) {
    return <Outlet />;
  }

  return <Navigate to="/landing" replace />;
};

export default ProtectedRoute;
