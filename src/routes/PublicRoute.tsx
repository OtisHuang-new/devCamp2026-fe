// Vị trí: src/routes/PublicRoute.tsx
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

  // Nếu ĐÃ đăng nhập HOẶC ĐÃ làm survey -> Đuổi vào Roadmap, không cho xem Landing nữa
  if (isAuthenticated || hasCompletedSurvey) {
    return <Navigate to="/roadmap" replace />;
  }

  // Nếu là người lạ -> Cho phép xem Landing/Survey
  return <Outlet />;
};

export default PublicRoute;
