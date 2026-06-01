import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../shared/context/AuthContext';

const PublicRoute = () => {
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
    return <Navigate to="/roadmap" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
