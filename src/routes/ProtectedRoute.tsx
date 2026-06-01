import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../shared/context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

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
