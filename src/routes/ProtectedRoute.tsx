// Vị trí: src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../shared/context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Kiểm tra xem người dùng đã hoàn thành survey chưa
  const hasCompletedSurvey = !!localStorage.getItem('survey_job');

  // Đợi Auth check xong để tránh bị nháy màn hình
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-white text-[#1E3A8A] font-bold">
        Loading...
      </div>
    );
  }

  // Nếu ĐÃ đăng nhập HOẶC ĐÃ làm survey -> Cho phép vào trong
  if (isAuthenticated || hasCompletedSurvey) {
    return <Outlet />;
  }

  // Nếu không có cả 2 -> Đuổi về Landing
  return <Navigate to="/landing" replace />;
};

export default ProtectedRoute;
